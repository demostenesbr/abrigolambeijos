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
import { AdminOnly } from '../../common/decorators/admin-only.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';
import type { AuthenticatedUser } from '../../common/guards/jwt-auth.guard';
import { SubmitAdoptionRequestDto } from './dto/submit-adoption-request.dto';

@Controller('adoption-requests')
@AdminOnly()
export class AdoptionRequestsController {
  constructor(
    private readonly adoptionRequestsService: AdoptionRequestsService,
  ) {}

  @Post('me')
  @Roles(UserRole.ADOPTER)
  submitForCurrentAdopter(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: SubmitAdoptionRequestDto,
  ) {
    return this.adoptionRequestsService.submitForAdopter(user, dto);
  }

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
