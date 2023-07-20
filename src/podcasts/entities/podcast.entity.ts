import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Podcast {
  @Field(() => Number)
  id: number;

  @Field(() => String)
  title: string;

  @Field(() => String)
  category: string;

  @Field(() => Number, { nullable: true })
  rating?: number;
}
