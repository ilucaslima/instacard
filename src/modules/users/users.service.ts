import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { UserResponseDTO, usersDTO } from './users.dto';

import { hash, compare } from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: usersDTO): Promise<UserResponseDTO> {
    const isExistUser = await this.prisma.user.findUnique({
      where: { login: data.login },
    });

    if (isExistUser) {
      throw new HttpException('user already exist', HttpStatus.CONFLICT);
    }
    const passwordHash = await hash(data.password, 10);

    const response: usersDTO = await this.prisma.user.create({
      data: {
        login: data.login,
        password: passwordHash,
        name: data.name,
        surname: data.surname,
      },
    });

    return new UserResponseDTO(response);
  }

  async update(id, data: usersDTO): Promise<usersDTO | void> {
    const isExistUser = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!isExistUser) {
      throw new HttpException('user already exist', HttpStatus.NOT_FOUND);
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

  async delete(id: string): Promise<void> {
    const isExistUser = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!isExistUser) {
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    }

    await this.prisma.user.delete({
      where: { id },
    });
  }

  async login(login: string, password: string): Promise<UserResponseDTO> {
    const user = await this.prisma.user.findUnique({
      where: { login },
    });

    if (!user) {
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    }

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      throw new HttpException('invalid redentials', HttpStatus.UNAUTHORIZED);
    }

    return new UserResponseDTO(user);
  }
}
