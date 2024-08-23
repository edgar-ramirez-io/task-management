import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common'
import { TasksService } from './tasks.service'
import { CreateTaskDto } from './dto/create-task.dto'
import { Task } from './task.entity'
import { AuthGuard } from '@nestjs/passport'
import { GetUser } from 'src/auth/get-user.decorators'
import { User } from 'src/auth/user.entity'

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get('/:id')
  async getTaskById(
    @Param('id') id: string,
    @GetUser() user: User,
  ): Promise<Task> {
    return await this.tasksService.getTaskById(id, user)
  }

  @Post()
  async createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.tasksService.createTask(createTaskDto, user)
  }

  @Delete('/:id')
  async(@Param('id') id: string, @GetUser() user: User): Promise<void> {
    return this.tasksService.deleteTask(id, user)
  }

  @Get()
  async getTasks(@GetUser() user: User): Promise<Task[]> {
    return this.tasksService.getTasks(user)
  }
}
