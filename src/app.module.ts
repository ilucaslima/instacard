import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users.module';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [UsersModule],
  providers: [PrismaService],
})
export class AppModule {}
