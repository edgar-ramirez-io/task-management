import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Task } from './task.entity'
import { Repository } from 'typeorm'
import { CreateTaskDto } from './dto/create-task.dto'
import { TaskStatus } from './task-status.enum'

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly tasksRepository: Repository<Task>,
  ) {}

  async getTaskById(id: string): Promise<Task> {
    const found = await this.tasksRepository.findOne({ where: { id } })

    if (!found) {
      throw new NotFoundException(`Task not found for ${id}`)
    }

    return found
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description } = createTaskDto
    const task = this.tasksRepository.create({
      title,
      description,
      status: TaskStatus.OPEN,
    })

    return await this.tasksRepository.save(task)
  }

  async deleteTask(id: string): Promise<void> {
    const result = await this.tasksRepository.delete({ id })

    if (result.affected === 0) {
      throw new NotFoundException(`Task not found for ${id}`)
    }
  }
}
