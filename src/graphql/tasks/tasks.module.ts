import { Module } from '@nestjs/common'
import { TasksResolver } from 'src/tasks/tasks.resolver'

@Module({
  providers: [TasksResolver],
})
export class TasksModuleGraphQL {}
