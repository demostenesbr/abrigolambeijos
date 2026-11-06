import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';
import { PartnerApplicationDto } from './dto/partner-application.dto';

@Injectable()
export class PartnersService {
  constructor(private readonly prisma: PrismaService) {}

  create(createPartnerDto: CreatePartnerDto) {
    return this.prisma.partners.create({ data: createPartnerDto });
  }

  async submitApplication(application: PartnerApplicationDto) {
    await this.prisma.partners.create({
      data: {
        ...application,
        location: `${application.city}, ${application.state}`,
        status: 'pending',
      },
    });
    return { message: 'Solicitação de parceria recebida para análise.' };
  }

  // Somente campos públicos de parceiros ativos; contato e endereço ficam restritos ao ADMIN.
  findPublic() {
    return this.prisma.partners.findMany({
      where: { status: 'active' },
      select: {
        id: true,
        name: true,
        type: true,
        city: true,
        state: true,
        description: true,
      },
      orderBy: { name: 'asc' },
    });
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
