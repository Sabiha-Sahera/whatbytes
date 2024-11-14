import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Task, TaskStatus } from '@prisma/client'; 

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.TaskCreateInput): Promise<Task> {
    try {
      return await this.prisma.task.create({ data });
    } catch (error) {
      throw new InternalServerErrorException('Error creating task');
    }
  }

  async findAll(): Promise<Task[]> {
    try {
      return await this.prisma.task.findMany();
    } catch (error) {
      throw new InternalServerErrorException('Error fetching tasks');
    }
  }

  // New method for task filtering
  async findFiltered(status?: TaskStatus, userId?: number): Promise<Task[]> {
    try {
      const filters: Prisma.TaskWhereInput = {};

      if (status) {
        filters.status = status;
      }

      if (userId) {
        filters.userId = userId;
      }

      return await this.prisma.task.findMany({
        where: filters,
      });
    } catch (error) {
      throw new InternalServerErrorException('Error fetching filtered tasks');
    }
  }

  async findOne(id: number): Promise<Task | null> {
    try {
      return await this.prisma.task.findUnique({ where: { id } });
    } catch (error) {
      throw new InternalServerErrorException('Error fetching task');
    }
  }

  async update(id: number, data: Prisma.TaskUpdateInput): Promise<Task> {
    const task = await this.prisma.task.findUnique({ where: { id } });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return this.prisma.task.update({ where: { id }, data });
  }

  async delete(id: number): Promise<Task> {
    const task = await this.prisma.task.findUnique({ where: { id } });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return this.prisma.task.delete({ where: { id } });
  }

  async updateTaskStatus(taskId: number, status: TaskStatus): Promise<Task> {
    const task = await this.prisma.task.findUnique({ where: { id: taskId } });

    if (!task) {
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    }

    return this.prisma.task.update({ where: { id: taskId }, data: { status } });
  }
}
