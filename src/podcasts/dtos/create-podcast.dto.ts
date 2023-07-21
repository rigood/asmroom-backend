import { InputType, OmitType } from '@nestjs/graphql';
import { Podcast } from '../entities/podcast.entity';

@InputType()
export class CreatePodcastDto extends OmitType(Podcast, ['id']) {}
