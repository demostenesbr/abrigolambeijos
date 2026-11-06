import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import {
  AdminOnly,
  AnyAuthenticated,
} from '../../common/decorators/admin-only.decorator';
import type { AuthenticatedUser } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { GenerateMyRecommendationsDto } from './dto/generate-recommendations.dto';
import { RecommendationsService } from './recommendations.service';
import { CreateRecommendationDto } from './dto/create-recommendation.dto';
import { UpdateRecommendationDto } from './dto/update-recommendation.dto';
import { GenerateRecommendationsDto } from './dto/generate-recommendations.dto';
import { ModelReportService } from './model-report.service';

@Controller('recommendations')
@AdminOnly()
export class RecommendationsController {
  constructor(
    private readonly recommendationsService: RecommendationsService,
    private readonly modelReportService: ModelReportService,
  ) {}

  // Única rota aberta a qualquer perfil autenticado: gera recomendações do próprio usuário.
  @Post('me')
  @AnyAuthenticated()
  generateForMe(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: GenerateMyRecommendationsDto,
  ) {
    return this.recommendationsService.generateForUser(
      user,
      body.profile,
      body.topN,
    );
  }

  @Post('generate')
  generate(@Body() generateRecommendationsDto: GenerateRecommendationsDto) {
    return this.recommendationsService.generate(generateRecommendationsDto);
  }

  @Post()
  create(@Body() createRecommendationDto: CreateRecommendationDto) {
    return this.recommendationsService.create(createRecommendationDto);
  }

  @Get()
  findAll() {
    return this.recommendationsService.findAll();
  }

  @Get('model/report')
  getModelReport() {
    return this.modelReportService.getReport();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.recommendationsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRecommendationDto: UpdateRecommendationDto,
  ) {
    return this.recommendationsService.update(+id, updateRecommendationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.recommendationsService.remove(+id);
  }
}
