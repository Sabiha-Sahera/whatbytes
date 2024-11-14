import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ProjectModule } from './project/project.module';
import { TaskModule } from './task/task.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/roles.guard';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,  // Global config, applies across the app
      envFilePath: '.env',  // Load from .env file
    }),
    AuthModule,  // Import authentication module
    UserModule,  // User module for handling user logic
    ProjectModule,  // Project module for project-related logic
    TaskModule,  // Task module for handling task logic
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,  // Apply roles guard globally
    },
  ],
})
export class AppModule {}
