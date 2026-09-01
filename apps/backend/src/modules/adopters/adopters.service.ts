import { Injectable } from '@nestjs/common';
import { CreateAdopterDto } from './dto/create-adopter.dto';
import { UpdateAdopterDto } from './dto/update-adopter.dto';

@Injectable()
export class AdoptersService {
  create(createAdopterDto: CreateAdopterDto) {
    return 'This action adds a new adopter';
  }

  findAll() {
    return `This action returns all adopters`;
  }

  findOne(id: number) {
    return `This action returns a #${id} adopter`;
  }

  update(id: number, updateAdopterDto: UpdateAdopterDto) {
    return `This action updates a #${id} adopter`;
  }

  remove(id: number) {
    return `This action removes a #${id} adopter`;
  }
}
