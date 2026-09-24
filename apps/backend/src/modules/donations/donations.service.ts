import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateDonationDto } from './dto/create-donation.dto';
import { UpdateDonationDto } from './dto/update-donation.dto';

@Injectable()
export class DonationsService {
  constructor(private readonly prisma: PrismaService) {}

  create(createDonationDto: CreateDonationDto) {
    return this.prisma.donations.create({ data: createDonationDto });
  }

  findAll() {
    return this.prisma.donations.findMany();
  }

  async findOne(id: number) {
    const donation = await this.prisma.donations.findUnique({ where: { id } });
    if (!donation) {
      throw new NotFoundException(`Doação #${id} não encontrada.`);
    }
    return donation;
  }

  async update(id: number, updateDonationDto: UpdateDonationDto) {
    await this.findOne(id);
    return this.prisma.donations.update({
      where: { id },
      data: updateDonationDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.donations.delete({ where: { id } });
  }
}
