import { NotFoundException } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { TasksService } from './tasks.service'
import { Task } from './task.entity'
import { User } from '../auth/user.entity'
import { TaskStatus } from './task-status.enum'

describe('TasksService', () => {
  let tasksService: TasksService
  let tasksRepository: Repository<Task>

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
          useClass: Repository,
        },
      ],
    }).compile()

    tasksService = moduleRef.get<TasksService>(TasksService)
    tasksRepository = moduleRef.get<Repository<Task>>(getRepositoryToken(Task))
  })

  describe('getTaskById', () => {
    const mockUser = { id: '1', username: 'testuser' }

    it('should return the task with the given id', async () => {
      const mockTask: Task = {
        id: '1',
        title: 'Task 1',
        description: 'Description 1',
        status: TaskStatus.OPEN,
        user: mockUser as User,
      }
      jest.spyOn(tasksRepository, 'findOne').mockResolvedValue(mockTask)

      const result = await tasksService.getTaskById('1', mockUser as User)

      expect(result).toEqual(mockTask)
      expect(tasksRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1', user: mockUser },
      })
    })

    it('should throw NotFoundException if task is not found', async () => {
      jest.spyOn(tasksRepository, 'findOne').mockResolvedValue(null)

      await expect(
        tasksService.getTaskById('1', mockUser as User),
      ).rejects.toThrowError(NotFoundException)
      expect(tasksRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1', user: mockUser },
      })
    })
  })
})
