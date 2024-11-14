import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { ProjectService } from './project.service';
import { Prisma, User } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Request as ExpressRequest } from 'express';

interface CustomRequest extends ExpressRequest {
  user: User;
}

@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'PROJECT_MANAGER')
  async create(@Body() createProjectDto: Prisma.ProjectCreateInput) {
    return this.projectService.create(createProjectDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'PROJECT_MANAGER')
  async findAll() {
    return this.projectService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async findOne(@Param('id') id: string, @Request() req: CustomRequest) {
    const project = await this.projectService.findOne(Number(id));
    const user = req.user;

    if (!project) {
      throw new ForbiddenException('Project not found');
    }

    // Allow ADMIN or PROJECT_MANAGER roles to access any project
    if (user && (user.role === 'ADMIN' || user.role === 'PROJECT_MANAGER')) {
      return project;
    }

    // Check if the user is assigned to the project
    const assignedUsers = await this.projectService.findAssignedUsers(Number(id));
    const isAssigned = assignedUsers.some((assignedUser: User) => assignedUser.id === user.id);

    if (user.role === 'USER' && !isAssigned) {
      throw new ForbiddenException('You do not have permission to view this project');
    }

    return project;
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'PROJECT_MANAGER')
  async update(@Param('id') id: string, @Body() updateProjectDto: Prisma.ProjectUpdateInput) {
    return this.projectService.update(Number(id), updateProjectDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async delete(@Param('id') id: string) {
    return this.projectService.delete(Number(id));
  }
}
