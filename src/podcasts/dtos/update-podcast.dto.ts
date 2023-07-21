import { Field, InputType, PartialType } from '@nestjs/graphql';
import { CreatePodcastDto } from './create-podcast.dto';

@InputType()
class UpdatePodcastInputType extends PartialType(CreatePodcastDto) {}

@InputType()
export class UpdatePodcastDto {
  @Field(() => Number)
  id: number;

  @Field(() => UpdatePodcastInputType)
  data: UpdatePodcastInputType;
}
