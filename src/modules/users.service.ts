import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { usersDTO } from './users.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: usersDTO): Promise<usersDTO> {
    const isExistUser = await this.prisma.user.findUnique({
      where: { login: data.login },
    });

    if (isExistUser) {
      throw new Error('User already exists');
    }

    const response: usersDTO = await this.prisma.user.create({
      data: {
        login: data.login,
        password: data.password,
        name: data.name,
        surname: data.surname,
      },
    });

    return response;
  }

  async update(id, data: usersDTO): Promise<usersDTO | void> {
    const isExistUser = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!isExistUser) {
      throw new Error('User not found');
    }

    const response: usersDTO = await this.prisma.user.update({
      where: { id },
      data: {
        login: data.login,
        password: data.password,
        name: data.name,
        surname: data.surname,
      },
    });

    return response;
  }
}
