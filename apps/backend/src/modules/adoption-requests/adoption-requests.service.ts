import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import type { AuthenticatedUser } from '../../common/guards/jwt-auth.guard';
import { SubmitAdoptionRequestDto } from './dto/submit-adoption-request.dto';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateAdoptionRequestDto } from './dto/create-adoption-request.dto';
import { UpdateAdoptionRequestDto } from './dto/update-adoption-request.dto';

@Injectable()
export class AdoptionRequestsService {
  constructor(private readonly prisma: PrismaService) {}

  create(createAdoptionRequestDto: CreateAdoptionRequestDto) {
    return this.prisma.adoptionRequests.create({
      data: createAdoptionRequestDto,
    });
  }

  async submitForAdopter(user: AuthenticatedUser, dto: SubmitAdoptionRequestDto) {
    return this.prisma.$transaction(
      async (tx) => {
        const pet = await tx.pets.findUnique({
          where: { rganimal: dto.animalReference },
        });
        if (!pet) {
          throw new NotFoundException('Animal disponível não encontrado.');
        }

        let adopter = await tx.adopters.findUnique({
          where: { userId: user.id },
        });
        if (!adopter) {
          const emailProfile = await tx.adopters.findUnique({
            where: { email: user.email },
          });
          if (emailProfile?.userId && emailProfile.userId !== user.id) {
            throw new ConflictException(
              'Este perfil de adotante já está vinculado a outra conta.',
            );
          }
          adopter = emailProfile
            ? await tx.adopters.update({
                where: { id: emailProfile.id },
                data: {
                  userId: user.id,
                  name: user.name ?? user.email,
                  phone: dto.phone,
                },
              })
            : await tx.adopters.create({
                data: {
                  userId: user.id,
                  email: user.email,
                  name: user.name ?? user.email,
                  phone: dto.phone,
                },
              });
        } else {
          adopter = await tx.adopters.update({
            where: { id: adopter.id },
            data: {
              email: user.email,
              name: user.name ?? user.email,
              phone: dto.phone,
            },
          });
        }

        const pending = await tx.adoptionRequests.findFirst({
          where: {
            adopterId: adopter.id,
            animalId: pet.id,
            status: 'pending',
          },
        });
        if (pending) {
          throw new ConflictException(
            'Você já tem uma solicitação pendente para este animal.',
          );
        }

        return tx.adoptionRequests.create({
          data: {
            adopterId: adopter.id,
            animalId: pet.id,
            petName: pet.name,
            userName: adopter.name,
            email: adopter.email,
            phone: dto.phone,
            address: dto.address,
            experience: dto.experience,
            home: dto.home,
            status: 'pending',
          },
        });
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
    ).catch((error: unknown) => {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2034'
      ) {
        throw new ConflictException(
          'A solicitação foi enviada em paralelo; tente novamente.',
        );
      }
      throw error;
    });
  }

  findAll() {
    return this.prisma.adoptionRequests.findMany();
  }

  async findOne(id: number) {
    const adoptionRequest = await this.prisma.adoptionRequests.findUnique({
      where: { id },
    });
    if (!adoptionRequest) {
      throw new NotFoundException(
        `Solicitação de adoção #${id} não encontrada.`,
      );
    }
    return adoptionRequest;
  }

  async update(id: number, updateAdoptionRequestDto: UpdateAdoptionRequestDto) {
    await this.findOne(id);
    return this.prisma.adoptionRequests.update({
      where: { id },
      data: updateAdoptionRequestDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.adoptionRequests.delete({ where: { id } });
  }
}
