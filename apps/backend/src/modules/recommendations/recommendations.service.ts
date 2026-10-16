import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateRecommendationDto } from './dto/create-recommendation.dto';
import { UpdateRecommendationDto } from './dto/update-recommendation.dto';
import { GenerateRecommendationsDto } from './dto/generate-recommendations.dto';
import { AdopterProfileDto } from './dto/generate-recommendations.dto';
import { MlBridgeService, MlRecommendation } from './ml-bridge.service';
import type { AuthenticatedUser } from '../../common/guards/jwt-auth.guard';

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
    return this.persist(dto.adopterId, ranked);
  }

  // Vincula o usuário logado a um Adopter (por e-mail) e gera o ranking dele
  async generateForUser(
    user: AuthenticatedUser,
    profile: AdopterProfileDto,
    topN = 5,
  ) {
    const account = await this.prisma.users.findUnique({
      where: { id: user.id },
    });
    const adopter = await this.prisma.adopters.upsert({
      where: { email: user.email },
      update: {},
      create: { email: user.email, name: account?.name ?? user.email },
    });

    const ranked = await this.mlBridge.recommendPets(profile, topN);
    await this.persist(adopter.id, ranked);
    return {
      adopterId: adopter.id,
      results: ranked.map((item) => ({
        petId: item.pet_id,
        name: item.name,
        species: item.species,
        score: item.compatibility_score,
      })),
    };
  }

  private persist(adopterId: number, ranked: MlRecommendation[]) {
    return Promise.all(
      ranked.map((item) =>
        this.prisma.recommendations.create({
          data: {
            adopterId,
            animalId: item.pet_id,
            recommendationText: `Compatibilidade prevista de ${(item.compatibility_score * 100).toFixed(1)}% com ${item.name} (${item.species}).`,
          },
        }),
      ),
    );
  }
}
