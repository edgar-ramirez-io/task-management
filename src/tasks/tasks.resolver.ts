import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'
import { TaskModel } from '../models/task.model'
import { TaskStatus } from './task-status.enum'
import { UserModel } from 'src/models/user.model'

@Resolver((of) => TaskModel)
export class TasksResolver {
  constructor() {}

  @Query((returns) => TaskModel)
  async task(@Args('id') id: string): Promise<TaskModel> {
    return {
      id: '1',
      title: 'Task 1',
      description: 'Task 1 description',
      status: TaskStatus.OPEN,
    } as TaskModel
  }

  @ResolveField()
  async user(@Parent() task: TaskModel): Promise<UserModel> {
    return {
      id: '1',
      username: 'user1',
      email: 'email',
      password: 'password',
    } as UserModel
  }
}
