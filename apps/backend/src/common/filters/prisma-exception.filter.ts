import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import type { Response } from 'express';

// Converte erros do Prisma em respostas HTTP claras em vez de 500 genérico.
@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(PrismaExceptionFilter.name);

  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    const code = String(exception.code);

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Erro interno ao acessar o banco de dados.';

    if (code === 'P2002') {
      status = HttpStatus.CONFLICT;
      message = 'Já existe um registro com esses dados.';
    } else if (code === 'P2003') {
      status = HttpStatus.CONFLICT;
      message = 'A operação viola uma relação de integridade entre registros.';
    } else if (code === 'P2025') {
      status = HttpStatus.NOT_FOUND;
      message = 'Registro não encontrado.';
    } else if (code === 'P2034') {
      status = HttpStatus.CONFLICT;
      message = 'Conflito de concorrência. Tente novamente.';
    } else if (code === 'ECONNREFUSED' || code === 'P1001' || code === 'P2024') {
      status = HttpStatus.SERVICE_UNAVAILABLE;
      message = 'Banco de dados indisponível. Tente novamente em instantes.';
    }

    if (status >= 500) this.logger.error(`${code}: ${exception.message}`);

    response.status(status).json({ statusCode: status, message });
  }
}
