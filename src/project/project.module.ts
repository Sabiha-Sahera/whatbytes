import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [ProjectController],  // Register the controller
  providers: [ProjectService, PrismaService],  // Register the service and PrismaService
})
export class ProjectModule {}
