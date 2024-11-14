import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { Prisma } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)  // Apply guards globally
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Roles('admin')  // Only admin can create users
  async create(@Body() createUserDto: Prisma.UserCreateInput) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @Roles('admin', 'project-manager')  // admin and project-manager roles can access
  async findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @Roles('admin', 'project-manager')  // Access controlled by roles
  async findOne(@Param('id') id: string) {
    return this.userService.findOne(Number(id));
  }

  @Put(':id')
  @Roles('admin')  // Only admin can update
  async update(@Param('id') id: string, @Body() updateUserDto: Prisma.UserUpdateInput) {
    return this.userService.update(Number(id), updateUserDto);
  }

  @Delete(':id')
  @Roles('admin')  // Only admin can delete users
  async delete(@Param('id') id: string) {
    return this.userService.delete(Number(id));
  }
}
