import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';

@Injectable()
export class PartnersService {
  constructor(private readonly prisma: PrismaService) {}

  create(createPartnerDto: CreatePartnerDto) {
    return this.prisma.partners.create({ data: createPartnerDto });
  }

  findAll() {
    return this.prisma.partners.findMany();
  }

  async findOne(id: number) {
    const partner = await this.prisma.partners.findUnique({ where: { id } });
    if (!partner) {
      throw new NotFoundException(`Parceiro #${id} não encontrado.`);
    }
    return partner;
  }

  async update(id: number, updatePartnerDto: UpdatePartnerDto) {
    await this.findOne(id);
    return this.prisma.partners.update({
      where: { id },
      data: updatePartnerDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.partners.delete({ where: { id } });
  }
}
