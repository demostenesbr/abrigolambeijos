import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import type { AuthenticatedUser } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { GenerateMyRecommendationsDto } from './dto/generate-recommendations.dto';
import { RecommendationsService } from './recommendations.service';
import { CreateRecommendationDto } from './dto/create-recommendation.dto';
import { UpdateRecommendationDto } from './dto/update-recommendation.dto';
import { GenerateRecommendationsDto } from './dto/generate-recommendations.dto';

@Controller('recommendations')
export class RecommendationsController {
  constructor(
    private readonly recommendationsService: RecommendationsService,
  ) {}

  @Post('me')
  @UseGuards(JwtAuthGuard)
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
