import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Project, User } from '@prisma/client';

@Injectable()
export class ProjectService {
  constructor(private prisma: PrismaService) {}

  // Create a new project
  async create(data: Prisma.ProjectCreateInput): Promise<Project> {
    try {
      return await this.prisma.project.create({
        data,
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error creating project');
    }
  }

  // Get all projects
  async findAll(): Promise<Project[]> {
    try {
      return await this.prisma.project.findMany();
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error fetching projects');
    }
  }

  // Get a single project by ID with users included
  async findOne(id: number): Promise<Project | null> {
    try {
      return await this.prisma.project.findUnique({
        where: { id },
        include: { users: true }, // Ensure that the users relation is included
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error fetching project');
    }
  }

  // Find assigned users for a project
  async findAssignedUsers(projectId: number): Promise<User[]> {
    try {
      const userProjects = await this.prisma.userProjects.findMany({
        where: { projectId },
        include: { user: true },  // Include user data from UserProjects
      });

      // Return an array of users assigned to the project
      return userProjects.map(userProject => userProject.user);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error fetching assigned users');
    }
  }

  // Update a project by ID
  async update(id: number, data: Prisma.ProjectUpdateInput): Promise<Project> {
    try {
      const project = await this.prisma.project.findUnique({
        where: { id },
      });

      if (!project) {
        throw new NotFoundException(`Project with ID ${id} not found`);
      }

      return await this.prisma.project.update({
        where: { id },
        data,
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error updating project');
    }
  }

  // Delete a project by ID
  async delete(id: number): Promise<Project> {
    try {
      const project = await this.prisma.project.findUnique({
        where: { id },
      });

      if (!project) {
        throw new NotFoundException(`Project with ID ${id} not found`);
      }

      return await this.prisma.project.delete({
        where: { id },
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error deleting project');
    }
  }
}
