import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { readFile } from 'fs/promises';
import * as path from 'path';

export interface CrossValidation {
  f1_mean: number;
  f1_std: number;
  folds: number[];
}

export interface ModelMetadata {
  model_name: string;
  trained_at: string;
  feature_columns: string[];
  train_size: number;
  test_size: number;
}

export interface EvaluationReport {
  selected_model: string;
  candidates: Record<string, CrossValidation>;
  baseline_most_frequent: { cv: CrossValidation; test: { f1: number } };
  split: string;
}

export interface TestMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1: number;
  confusion_matrix: [[number, number], [number, number]];
}

function validScore(value: number): boolean {
  return (
    typeof value === 'number' &&
    Number.isFinite(value) &&
    value >= 0 &&
    value <= 1
  );
}

function validCv(cv: CrossValidation | undefined): boolean {
  return (
    !!cv &&
    validScore(cv.f1_mean) &&
    validScore(cv.f1_std) &&
    Array.isArray(cv.folds) &&
    cv.folds.length > 0 &&
    cv.folds.every(validScore)
  );
}

// Conta registros, não linhas: campos CSV podem conter quebras de linha.
export function countCsvDataRecords(csv: string): number {
  let quoted = false;
  let records = 0;
  let hasContent = false;
  for (let i = 0; i < csv.length; i++) {
    const char = csv[i];
    if (char === '"') {
      if (quoted && csv[i + 1] === '"') i++;
      else quoted = !quoted;
      hasContent = true;
    } else if (!quoted && (char === '\n' || char === '\r')) {
      if (char === '\r' && csv[i + 1] === '\n') i++;
      if (hasContent) records++;
      hasContent = false;
    } else {
      hasContent = true;
    }
  }
  if (quoted) throw new Error('CSV com campo não encerrado');
  if (hasContent) records++;
  if (records === 0) throw new Error('CSV sem cabeçalho');
  return records - 1;
}

@Injectable()
export class ModelReportService {
  private readonly logger = new Logger(ModelReportService.name);

  async getReport() {
    const mlPath =
      process.env.ML_APP_PATH ?? path.resolve(process.cwd(), '..', 'ml');
    try {
      const [metadataJson, reportJson, metricsJson, syntheticCsv, realCsv] =
        await Promise.all([
          readFile(
            path.join(mlPath, 'models', 'animal-recommender', 'metadata.json'),
            'utf8',
          ),
          readFile(
            path.join(mlPath, 'artfacts', 'reports', 'evaluation-report.json'),
            'utf8',
          ),
          readFile(
            path.join(mlPath, 'artfacts', 'reports', 'metrics.json'),
            'utf8',
          ),
          readFile(path.join(mlPath, 'datasets', 'raw', 'pets.csv'), 'utf8'),
          readFile(
            path.join(mlPath, 'datasets', 'processed', 'pets_processed.csv'),
            'utf8',
          ),
        ]);
      const metadata = JSON.parse(metadataJson) as ModelMetadata;
      const evaluation = JSON.parse(reportJson) as EvaluationReport;
      const metrics = JSON.parse(metricsJson) as TestMetrics;
      if (
        !metadata ||
        !evaluation ||
        !metrics ||
        typeof metadata.model_name !== 'string' ||
        typeof metadata.trained_at !== 'string' ||
        Number.isNaN(Date.parse(metadata.trained_at)) ||
        !Number.isInteger(metadata.train_size) ||
        metadata.train_size <= 0 ||
        !Number.isInteger(metadata.test_size) ||
        metadata.test_size <= 0 ||
        metadata.model_name !== evaluation.selected_model ||
        !evaluation.candidates ||
        !validCv(evaluation.candidates[metadata.model_name]) ||
        !Object.values(evaluation.candidates).every(validCv) ||
        !evaluation.baseline_most_frequent ||
        !validCv(evaluation.baseline_most_frequent.cv) ||
        !validScore(evaluation.baseline_most_frequent.test?.f1) ||
        !Array.isArray(metadata.feature_columns) ||
        !metadata.feature_columns.every(
          (column) => typeof column === 'string',
        ) ||
        ![
          metrics.accuracy,
          metrics.precision,
          metrics.recall,
          metrics.f1,
        ].every(validScore) ||
        !Array.isArray(metrics.confusion_matrix) ||
        metrics.confusion_matrix.length !== 2 ||
        metrics.confusion_matrix.some(
          (row) =>
            !Array.isArray(row) ||
            row.length !== 2 ||
            row.some((value) => !Number.isInteger(value) || value < 0),
        ) ||
        metrics.confusion_matrix
          .flat()
          .reduce((sum, value) => sum + value, 0) !== metadata.test_size
      ) {
        throw new Error('Artefatos de avaliação inconsistentes');
      }
      return {
        metadata,
        evaluation,
        metrics,
        catalog: {
          syntheticPets: countCsvDataRecords(syntheticCsv),
          realPets: countCsvDataRecords(realCsv),
        },
      };
    } catch (error) {
      this.logger.error('Não foi possível carregar os artefatos de ML', error);
      throw new ServiceUnavailableException(
        'Não foi possível carregar os dados do modelo de ML.',
      );
    }
  }
}
