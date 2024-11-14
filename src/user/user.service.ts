import { Injectable, NotFoundException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Prisma, User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    try {
      return await this.prisma.user.findUnique({ where: { email } });
    } catch (error) {
      throw new InternalServerErrorException('Error fetching user by email');
    }
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    try {
      const existingUser = await this.prisma.user.findUnique({ where: { email: data.email } });
      if (existingUser) {
        throw new BadRequestException('Email already in use');
      }

      const hashedPassword = await bcrypt.hash(data.password, 10);

      return await this.prisma.user.create({
        data: { ...data, password: hashedPassword },
      });
    } catch (error) {
      throw new InternalServerErrorException('Error creating user');
    }
  }

  async findAll(): Promise<User[]> {
    try {
      return await this.prisma.user.findMany();
    } catch (error) {
      throw new InternalServerErrorException('Error fetching users');
    }
  }

  async findOne(id: number): Promise<User | null> {
    try {
      const user = await this.prisma.user.findUnique({ where: { id } });
      if (!user) throw new NotFoundException(`User with ID ${id} not found`);
      return user;
    } catch (error) {
      throw new InternalServerErrorException('Error fetching user');
    }
  }

  async update(id: number, data: Prisma.UserUpdateInput): Promise<User> {
    try {
      const user = await this.prisma.user.findUnique({ where: { id } });
      if (!user) throw new NotFoundException(`User with ID ${id} not found`);

      if (data.password && typeof data.password === 'string') {
        data.password = await bcrypt.hash(data.password, 10);  // Re-hash password
      }

      return await this.prisma.user.update({
        where: { id },
        data,
      });
    } catch (error) {
      throw new InternalServerErrorException('Error updating user');
    }
  }

  async delete(id: number): Promise<User> {
    try {
      const user = await this.prisma.user.findUnique({ where: { id } });
      if (!user) throw new NotFoundException(`User with ID ${id} not found`);

      return await this.prisma.user.delete({ where: { id } });
    } catch (error) {
      throw new InternalServerErrorException('Error deleting user');
    }
  }
}
