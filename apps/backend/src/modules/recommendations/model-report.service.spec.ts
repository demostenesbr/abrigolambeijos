import { readFile } from 'fs/promises';
import { ServiceUnavailableException } from '@nestjs/common';
import {
  countCsvDataRecords,
  ModelReportService,
} from './model-report.service';

jest.mock('fs/promises', () => ({ readFile: jest.fn() }));
const mockedReadFile = jest.mocked(readFile);

const metadata = {
  model_name: 'random_forest',
  trained_at: '2026-10-16T19:44:23Z',
  feature_columns: ['pet_age'],
  train_size: 4,
  test_size: 2,
};
const cv = { f1_mean: 0.8, f1_std: 0.1, folds: [0.7, 0.9] };
const evaluation = {
  selected_model: 'random_forest',
  candidates: { random_forest: cv },
  baseline_most_frequent: { cv, test: { f1: 0.7 } },
  split: 'grouped',
};
const metrics = {
  accuracy: 1,
  precision: 1,
  recall: 1,
  f1: 1,
  confusion_matrix: [
    [1, 0],
    [0, 1],
  ],
};

function mockFiles(model = metadata, testMetrics = metrics) {
  mockedReadFile.mockImplementation((file) => {
    if (typeof file !== 'string')
      return Promise.reject(new Error('Caminho inválido'));
    const name = file;
    if (name.endsWith('metadata.json'))
      return Promise.resolve(JSON.stringify(model));
    if (name.endsWith('evaluation-report.json'))
      return Promise.resolve(JSON.stringify(evaluation));
    if (name.endsWith('metrics.json'))
      return Promise.resolve(JSON.stringify(testMetrics));
    if (name.endsWith('pets_processed.csv'))
      return Promise.resolve('id,name\n1,real\n');
    if (name.endsWith('pets.csv'))
      return Promise.resolve('id,name\n1,a\n2,b\n');
    return Promise.reject(new Error('Arquivo inesperado'));
  });
}

describe('ModelReportService', () => {
  beforeEach(() => jest.clearAllMocks());

  it('conta registros CSV com campos multilinha e aspas escapadas', () => {
    expect(countCsvDataRecords('id,name\r\n1,"a\nb"\r\n2,"c ""d"""\r\n')).toBe(
      2,
    );
    expect(countCsvDataRecords('id,name\n')).toBe(0);
    expect(() => countCsvDataRecords('id,name\n1,"aberto')).toThrow();
  });

  it('retorna os relatórios e as contagens dos catálogos separados', async () => {
    mockFiles();
    const report = await new ModelReportService().getReport();
    expect(report.metadata).toEqual(metadata);
    expect(report.metrics).toEqual(metrics);
    expect(report.catalog).toEqual({ syntheticPets: 2, realPets: 1 });
  });

  it('rejeita artefatos inconsistentes', async () => {
    mockFiles({ ...metadata, model_name: 'knn' });
    await expect(new ModelReportService().getReport()).rejects.toBeInstanceOf(
      ServiceUnavailableException,
    );
  });

  it('rejeita matriz incompatível com o tamanho do teste', async () => {
    mockFiles(metadata, {
      ...metrics,
      confusion_matrix: [
        [1, 0],
        [0, 0],
      ],
    });
    await expect(new ModelReportService().getReport()).rejects.toBeInstanceOf(
      ServiceUnavailableException,
    );
  });

  it('informa indisponibilidade quando um arquivo não pode ser lido', async () => {
    mockedReadFile.mockRejectedValue(new Error('arquivo ausente'));
    await expect(new ModelReportService().getReport()).rejects.toBeInstanceOf(
      ServiceUnavailableException,
    );
  });
});
