import { Field, InputType, Int, ObjectType, PickType } from '@nestjs/graphql';
import { IsInt } from 'class-validator';
import { Episode } from '../entities/episode.entity';
import { CoreOutput } from 'src/common/dtos/output.dto';

@InputType()
export class CreateEpisodeInput extends PickType(
  Episode,
  ['title', 'description', 'youtubeId'],
  InputType,
) {
  @Field((type) => Int)
  @IsInt()
  channelId: number;
}

@ObjectType()
export class CreateEpisodeOutput extends CoreOutput {}
