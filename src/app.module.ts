import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { PrismaService } from '../prisma/prisma.service';
import { CardsModule } from './modules/cards/cards.module';

@Module({
  imports: [UsersModule, CardsModule],
  providers: [PrismaService],
})
export class AppModule {}
