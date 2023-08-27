import { InputType, ObjectType, Field, Int } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Episode } from '../entities/episode.entity';

@InputType()
export class SearchEpisodesInput {
  @Field((type) => String)
  query: string;
}

@ObjectType()
export class SearchEpisodesOutput extends CoreOutput {
  @Field((type) => [Episode], { nullable: true })
  episodes?: Episode[];

  @Field((type) => Int, { nullable: true })
  totalCount?: number;
}
