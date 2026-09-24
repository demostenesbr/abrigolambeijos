import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { spawn } from 'child_process';
import * as path from 'path';
import { AdopterProfileDto } from './dto/generate-recommendations.dto';

export interface MlRecommendation {
  pet_id: number;
  name: string;
  species: string;
  compatibility_score: number;
}

const ML_TIMEOUT_MS = 30_000; // cold start do Python + pandas/sklearn leva ~15-20s

@Injectable()
export class MlBridgeService {
  private readonly mlAppPath =
    process.env.ML_APP_PATH ?? path.resolve(process.cwd(), '..', 'ml');

  private readonly pythonExecutable =
    process.env.ML_PYTHON_EXECUTABLE ??
    path.join(
      this.mlAppPath,
      '.venv',
      process.platform === 'win32' ? 'Scripts' : 'bin',
      process.platform === 'win32' ? 'python.exe' : 'python',
    );

  // Chama `apps/ml/src/interference/cli.py` (venv Python) via subprocess local
  async recommendPets(
    profile: AdopterProfileDto,
    topN: number,
  ): Promise<MlRecommendation[]> {
    const child = spawn(this.pythonExecutable, ['-m', 'src.interference.cli'], {
      cwd: this.mlAppPath,
    });

    let stdout = '';
    let stderr = '';

    const result = await new Promise<MlRecommendation[]>((resolve, reject) => {
      const timer = setTimeout(() => {
        child.kill();
        reject(new Error('Tempo excedido ao gerar recomendações via ML.'));
      }, ML_TIMEOUT_MS);

      child.stdout.on('data', (chunk: Buffer) => {
        stdout += chunk.toString();
      });
      child.stderr.on('data', (chunk: Buffer) => {
        stderr += chunk.toString();
      });

      child.on('error', (error) => {
        clearTimeout(timer);
        reject(error);
      });

      child.on('close', (code) => {
        clearTimeout(timer);
        if (code !== 0) {
          reject(
            new Error(stderr || `Processo ML encerrou com código ${code}.`),
          );
          return;
        }
        try {
          resolve(JSON.parse(stdout) as MlRecommendation[]);
        } catch {
          reject(new Error(`Saída inválida do processo ML: ${stdout}`));
        }
      });

      child.stdin.write(JSON.stringify({ profile, top_n: topN }));
      child.stdin.end();
    }).catch((error: Error) => {
      throw new InternalServerErrorException(
        `Falha ao gerar recomendações via ML: ${error.message}`,
      );
    });

    return result;
  }
}
