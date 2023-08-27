import { InputType, ObjectType, Field, Int } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Review } from '../entities/review.entity';

@InputType()
export class SearchReviewsInput {
  @Field((type) => Int, { nullable: true })
  episodeId?: number;

  @Field((type) => Int, { nullable: true })
  reviewerId?: number;
}

@ObjectType()
export class SearchReviewsOutput extends CoreOutput {
  @Field((type) => [Review], { nullable: true })
  reviews?: Review[];

  @Field((type) => Int, { nullable: true })
  totalCount?: number;
}
