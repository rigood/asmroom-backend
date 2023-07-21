import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Podcast } from './entities/podcast.entity';
import { CreatePodcastDto } from './dtos/create-podcast.dto';
import { PodcastsService } from './podcasts.service';
import { UpdatePodcastDto } from './dtos/update-podcast.dto';

@Resolver(() => Podcast)
export class PodcastsResolver {
  constructor(private readonly podcastsService: PodcastsService) {}

  @Query(() => [Podcast])
  getAllPodcasts(): Promise<Podcast[]> {
    return this.podcastsService.getAllPodcasts();
  }

  @Mutation(() => Boolean)
  async createPodcast(
    @Args('input') createPodcastDto: CreatePodcastDto,
  ): Promise<boolean> {
    try {
      await this.podcastsService.createPodcast(createPodcastDto);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  @Mutation(() => Boolean)
  async updatePodcast(
    @Args('input') updatePodcastDto: UpdatePodcastDto,
  ): Promise<boolean> {
    try {
      await this.podcastsService.updatePodcast(updatePodcastDto);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
