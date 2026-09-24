import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AdoptionRequestsService } from './adoption-requests.service';
import { CreateAdoptionRequestDto } from './dto/create-adoption-request.dto';
import { UpdateAdoptionRequestDto } from './dto/update-adoption-request.dto';

@Controller('adoption-requests')
export class AdoptionRequestsController {
  constructor(
    private readonly adoptionRequestsService: AdoptionRequestsService,
  ) {}

  @Post()
  create(@Body() createAdoptionRequestDto: CreateAdoptionRequestDto) {
    return this.adoptionRequestsService.create(createAdoptionRequestDto);
  }

  @Get()
  findAll() {
    return this.adoptionRequestsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adoptionRequestsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAdoptionRequestDto: UpdateAdoptionRequestDto,
  ) {
    return this.adoptionRequestsService.update(+id, updateAdoptionRequestDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adoptionRequestsService.remove(+id);
  }
}
