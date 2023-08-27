import { Field, InputType, Int, ObjectType, PickType } from '@nestjs/graphql';
import { IsInt } from 'class-validator';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Review } from '../entities/review.entity';

@InputType()
export class CreateReviewInput extends PickType(
  Review,
  ['text', 'rating'],
  InputType,
) {
  @Field((type) => Int)
  @IsInt()
  episodeId: number;
}

@ObjectType()
export class CreateReviewOutput extends CoreOutput {}
