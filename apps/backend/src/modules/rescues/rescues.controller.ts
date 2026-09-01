import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RescuesService } from './rescues.service';
import { CreateRescueDto } from './dto/create-rescue.dto';
import { UpdateRescueDto } from './dto/update-rescue.dto';

@Controller('rescues')
export class RescuesController {
  constructor(private readonly rescuesService: RescuesService) {}

  @Post()
  create(@Body() createRescueDto: CreateRescueDto) {
    return this.rescuesService.create(createRescueDto);
  }

  @Get()
  findAll() {
    return this.rescuesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rescuesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRescueDto: UpdateRescueDto) {
    return this.rescuesService.update(+id, updateRescueDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rescuesService.remove(+id);
  }
}
