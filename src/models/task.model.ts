import { Directive, Field, ID, ObjectType } from '@nestjs/graphql'
import { TaskStatus } from '../tasks/task-status.enum'
import { UserModel } from './user.model'

@ObjectType({ description: 'Task Model' })
export class TaskModel {
  @Field((type) => ID)
  id: string

  @Directive('@upper')
  title: string

  @Field({ nullable: true })
  description?: string

  @Field()
  status: TaskStatus

  @Field((type) => UserModel)
  user: UserModel
}
