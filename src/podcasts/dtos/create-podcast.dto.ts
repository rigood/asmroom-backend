import { Field, ArgsType, InputType } from '@nestjs/graphql';
import { IsNumber, IsString, Length } from 'class-validator';

@ArgsType()
export class CreatePodcastDto {
  @Field(() => Number)
  @IsNumber()
  id: number;

  @Field(() => String)
  @IsString()
  @Length(2, 50)
  title: string;

  @Field(() => String)
  @IsString()
  category: string;

  @Field(() => Number, { nullable: true })
  @IsNumber()
  rating?: number;
}

// @InputType()
// export class CreatePodcastDto {
//   @Field(() => Number)
//   id: number;

//   @Field(() => String)
//   title: string;

//   @Field(() => String)
//   category: string;

//   @Field(() => Number, { nullable: true })
//   rating?: number;
// }
