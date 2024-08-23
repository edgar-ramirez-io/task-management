import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Task } from './task.entity'
import { Repository } from 'typeorm'
import { CreateTaskDto } from './dto/create-task.dto'
import { TaskStatus } from './task-status.enum'
import { User } from 'src/auth/user.entity'

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly tasksRepository: Repository<Task>,
  ) {}

  async getTaskById(id: string, user: User): Promise<Task> {
    const found = await this.tasksRepository.findOne({ where: { id, user } })

    if (!found) {
      throw new NotFoundException(`Task not found for ${id}`)
    }

    return found
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto
    const task = this.tasksRepository.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user,
    })

    return await this.tasksRepository.save(task)
  }

  async deleteTask(id: string, user: User): Promise<void> {
    const result = await this.tasksRepository.delete({ id, user })

    if (result.affected === 0) {
      throw new NotFoundException(`Task not found for ${id}`)
    }
  }

  async getTasks(user: User): Promise<Task[]> {
    const query = this.tasksRepository.createQueryBuilder('task')
    query.where({ user })

    try {
      const tasks = await query.getMany()
      return tasks
    } catch (error) {
      throw new InternalServerErrorException()
    }
  }
}
