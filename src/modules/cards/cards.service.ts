import { Injectable, StreamableFile } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';
import sharp from 'sharp';
import { text } from './templates/text.template';

@Injectable()
export class CardsService {
  async generateCard(
    imageBuffer: Buffer,
    title: string,
  ): Promise<StreamableFile> {
    const templatePath = join(__dirname, 'templates', 'tarja.png');

    const templateBuffer = readFileSync(templatePath);
    const width = 991;
    const height = 655;
    const borderRadius = 32;

    function wrapText(text: string, maxChars: number) {
      const words = text.split(' ');
      const lines: string[] = [];
      let currentLine = '';

      for (const word of words) {
        if ((currentLine + word).length > maxChars) {
          lines.push(currentLine.trim());
          currentLine = '';
        }

        currentLine += word + ' ';
      }

      lines.push(currentLine.trim());
      return lines;
    }

    const roundedCorners = Buffer.from(`
  <svg>
    <rect 
      x="0" 
      y="0" 
      width="${width}" 
      height="${height}" 
      rx="${borderRadius}" 
      ry="${borderRadius}" 
    />
  </svg>
`);

    const lines = wrapText(title, 50);

    const lineHeight = 50;
    const startY = height / 2 - ((lines.length - 1) * lineHeight) / 2;

    const tspans = lines
      .map(
        (line, index) =>
          `<tspan x="0" y="${startY + index * lineHeight}">${line}</tspan>`,
      )
      .join('');

    const baseImage = await sharp(imageBuffer)
      .resize({ width, height, fit: 'cover' })
      .composite([
        {
          input: roundedCorners,
          blend: 'dest-in',
        },
      ])
      .png()
      .toBuffer();

    const finalImage = await sharp(templateBuffer)
      .composite([
        {
          input: baseImage,
          top: 36,
          left: 50,
        },
        { input: text.generate(width, height, tspans), top: 525, left: 60 },
      ])
      .png()
      .toBuffer();

    return new StreamableFile(finalImage, {
      type: 'image/png',
      disposition: 'inline',
    });
  }
}
