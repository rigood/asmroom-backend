import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Podcast } from './entities/podcast.entity';
import { CreatePodcastDto } from './dtos/create-podcast.dto';

@Resolver(() => Podcast)
export class PodcastsResolver {
  @Query(() => [Podcast])
  getAllPodcasts(@Args('newsOnly') newsOnly: boolean): Podcast[] {
    console.log(newsOnly);
    return [];
  }

  @Mutation(() => Boolean)
  createPodcast(@Args() createPodcastDto: CreatePodcastDto): boolean {
    console.log(createPodcastDto);
    return true;
  }
}
