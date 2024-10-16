import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType({ description: 'User Model' })
export class UserModel {
  @Field((type) => ID)
  id: string

  @Field()
  username: string

  @Field()
  email: string

  @Field()
  password: string

  //   @Field()
  //   tasks: TaskModel[]
}
