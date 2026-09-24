import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './common/prisma/prisma.module';
import { GlobalJwtModule } from './common/jwt/jwt.module';
import { AuthModule } from './modules/auth/auth.module';
import { PetsModule } from './modules/pets/pets.module';
import { RecommendationsModule } from './modules/recommendations/recommendations.module';
import { DonationsModule } from './modules/donations/donations.module';
import { RescuesModule } from './modules/rescues/rescues.module';
import { AdoptionsModule } from './modules/adoptions/adoptions.module';
import { AdoptionRequestsModule } from './modules/adoption-requests/adoption-requests.module';
import { AdoptersModule } from './modules/adopters/adopters.module';
import { PartnersModule } from './modules/partners/partners.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    PrismaModule,
    GlobalJwtModule,
    AuthModule,
    PetsModule,
    UsersModule,
    AdoptersModule,
    AdoptionsModule,
    AdoptionRequestsModule,
    RescuesModule,
    DonationsModule,
    RecommendationsModule,
    PartnersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
