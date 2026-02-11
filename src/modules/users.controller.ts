import { Body, Controller, Delete, Param, Post, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { usersDTO } from './users.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  async create(@Body() data: usersDTO) {
    const response = await this.usersService.create(data);
    return response;
  }

  @Put(':id')
  async update(@Body() data: usersDTO, @Param('id') id: string) {
    const response = await this.usersService.update(id, data);
    return response;
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.usersService.delete(id);
    return { message: 'User deleted successfully' };
  }

  @Post('login')
  async login(@Body() data: { login: string; password: string }) {
    const response = await this.usersService.login(data.login, data.password);
    return response;
  }
}
