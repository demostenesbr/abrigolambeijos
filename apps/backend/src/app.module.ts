import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PetsModule } from './modules/pets/pets.module';
import { RecommendationsModule } from './modules/recommendations/recommendations.module';
import { DonationsModule } from './modules/donations/donations.module';
import { RescuesModule } from './modules/rescues/rescues.module';
import { AdoptionsModule } from './modules/adoptions/adoptions.module';
import { AdoptersModule } from './modules/adopters/adopters.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    PetsModule,
    UsersModule,
    AdoptersModule,
    AdoptionsModule,
    RescuesModule,
    DonationsModule,
    RecommendationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
