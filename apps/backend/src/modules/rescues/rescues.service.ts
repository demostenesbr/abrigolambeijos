import { Injectable } from '@nestjs/common';
import { CreateRescueDto } from './dto/create-rescue.dto';
import { UpdateRescueDto } from './dto/update-rescue.dto';

@Injectable()
export class RescuesService {
  create(createRescueDto: CreateRescueDto) {
    return 'This action adds a new rescue';
  }

  findAll() {
    return `This action returns all rescues`;
  }

  findOne(id: number) {
    return `This action returns a #${id} rescue`;
  }

  update(id: number, updateRescueDto: UpdateRescueDto) {
    return `This action updates a #${id} rescue`;
  }

  remove(id: number) {
    return `This action removes a #${id} rescue`;
  }
}
