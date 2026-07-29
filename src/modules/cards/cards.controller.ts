import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Headers,
  BadRequestException,
  Header,
  Body,
} from '@nestjs/common';
import type { Response } from '@nestjs/common';

import { CardsService } from './cards.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Post()
  @Header('Content-Type', 'image/png')
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @UploadedFile() file: { buffer: Buffer },
    @Body() body: { title: string },
  ) {
    if (!file || !file.buffer) {
      throw new BadRequestException('Arquivo inválido');
    }

    const image = await this.cardsService.generateCard(file.buffer, body.title);

    return image;
  }
}
