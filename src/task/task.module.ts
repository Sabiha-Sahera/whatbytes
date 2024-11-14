import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { PrismaService } from '../prisma/prisma.service'; // Import PrismaService
import { UserModule } from '../user/user.module'; // Import UserModule
import { ProjectModule } from '../project/project.module'; // Import ProjectModule

@Module({
  imports: [UserModule, ProjectModule],
  providers: [TaskService, PrismaService],
  controllers: [TaskController],
})
export class TaskModule {}
