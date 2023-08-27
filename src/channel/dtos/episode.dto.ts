import { InputType, ObjectType, Field, Int } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Episode } from '../entities/episode.entity';

@InputType()
export class EpisodeInput {
  @Field((type) => Int)
  episodeId: number;
}

@ObjectType()
export class EpisodeOutput extends CoreOutput {
  @Field((type) => Episode, { nullable: true })
  episode?: Episode;
}
