import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Request, Query, ForbiddenException } from '@nestjs/common';
import { TaskService } from './task.service';
import { Prisma, TaskStatus, User } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Request as ExpressRequest } from 'express';

interface CustomRequest extends ExpressRequest {
  user: User;
}

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'PROJECT_MANAGER')
  async create(@Body() createTaskDto: Prisma.TaskCreateInput) {
    return this.taskService.create(createTaskDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'PROJECT_MANAGER')
  async findAll(
    @Query('status') status?: TaskStatus, // Filtering by status
    @Query('userId') userId?: number      // Filtering by userId
  ) {
    return this.taskService.findFiltered(status, userId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async findOne(@Param('id') id: string, @Request() req: CustomRequest) {
    const task = await this.taskService.findOne(Number(id));
    const user = req.user;

    if (!task) {
      throw new ForbiddenException('Task not found');
    }

    // Check if USER is allowed to view the task
    if (user.role === 'USER' && task.userId !== user.id) {
      throw new ForbiddenException('You do not have permission to view this task');
    }

    return task;
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async update(@Param('id') id: string, @Body() updateTaskDto: Prisma.TaskUpdateInput, @Request() req: CustomRequest) {
    const task = await this.taskService.findOne(Number(id));

    if (!task) {
      throw new ForbiddenException('Task not found');
    }

    // Check if USER is allowed to update the task
    if (req.user.role === 'USER' && task.userId !== req.user.id) {
      throw new ForbiddenException('You do not have permission to modify this task');
    }

    return this.taskService.update(Number(id), updateTaskDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async delete(@Param('id') id: string) {
    return this.taskService.delete(Number(id));
  }

  @Post(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async updateStatus(@Param('id') id: string, @Body() statusDto: { status: TaskStatus }) {
    return this.taskService.updateTaskStatus(Number(id), statusDto.status);
  }
}
