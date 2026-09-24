import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateRecommendationDto } from './dto/create-recommendation.dto';
import { UpdateRecommendationDto } from './dto/update-recommendation.dto';
import { GenerateRecommendationsDto } from './dto/generate-recommendations.dto';
import { MlBridgeService } from './ml-bridge.service';

@Injectable()
export class RecommendationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mlBridge: MlBridgeService,
  ) {}

  create(createRecommendationDto: CreateRecommendationDto) {
    return this.prisma.recommendations.create({
      data: createRecommendationDto,
    });
  }

  findAll() {
    return this.prisma.recommendations.findMany();
  }

  async findOne(id: number) {
    const recommendation = await this.prisma.recommendations.findUnique({
      where: { id },
    });
    if (!recommendation) {
      throw new NotFoundException(`Recomendação #${id} não encontrada.`);
    }
    return recommendation;
  }

  async update(id: number, updateRecommendationDto: UpdateRecommendationDto) {
    await this.findOne(id);
    return this.prisma.recommendations.update({
      where: { id },
      data: updateRecommendationDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.recommendations.delete({ where: { id } });
  }

  // Chama o modelo treinado (apps/ml) e persiste o ranking retornado em Recommendations
  async generate(dto: GenerateRecommendationsDto) {
    const adopter = await this.prisma.adopters.findUnique({
      where: { id: dto.adopterId },
    });
    if (!adopter) {
      throw new NotFoundException(`Adotante #${dto.adopterId} não encontrado.`);
    }

    const topN = dto.topN ?? 5;
    const ranked = await this.mlBridge.recommendPets(dto.profile, topN);

    return Promise.all(
      ranked.map((item) =>
        this.prisma.recommendations.create({
          data: {
            adopterId: dto.adopterId,
            animalId: item.pet_id,
            recommendationText: `Compatibilidade prevista de ${(item.compatibility_score * 100).toFixed(1)}% com ${item.name} (${item.species}).`,
          },
        }),
      ),
    );
  }
}
