import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
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
const ML_INVALID_INPUT_EXIT_CODE = 2;

export interface MlPetInput {
  id: number;
  name: string;
  species: string;
  age: number;
  energy_level: string;
  temperament: string;
  sociability: string;
  exercise_need: string;
  apartment_adaptability: string;
  children_compatibility: boolean;
  dogs_compatibility: boolean;
  cats_compatibility: boolean;
}

class MlInvalidInputError extends Error {}

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
    pets?: MlPetInput[],
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
        if (code === ML_INVALID_INPUT_EXIT_CODE) {
          reject(new MlInvalidInputError(stderr.trim()));
          return;
        }
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

      child.stdin.write(JSON.stringify({ profile, top_n: topN, pets }));
      child.stdin.end();
    }).catch((error: Error) => {
      if (error instanceof MlInvalidInputError) {
        throw new BadRequestException(error.message);
      }
      throw new InternalServerErrorException(
        `Falha ao gerar recomendações via ML: ${error.message}`,
      );
    });

    return result;
  }
}
