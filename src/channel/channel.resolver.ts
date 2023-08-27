import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Channel } from './entities/channel.entity';
import { Episode } from './entities/episode.entity';
import { ChannelsService } from './channel.service';
import { MyChannelOutput } from './dtos/myChannel.dto';
import { Role } from 'src/auth/role.decorator';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { User, UserRole } from 'src/users/entities/user.entity';
import { EditChannelInput, EditChannelOutput } from './dtos/edit-channel.dto';
import {
  CreateEpisodeInput,
  CreateEpisodeOutput,
} from './dtos/create-episode.dto';
import { ChannelInput, ChannelOutput } from './dtos/channel.dto';
import { EpisodesInput, EpisodesOutput } from './dtos/episodes.dto';
import {
  SearchEpisodesInput,
  SearchEpisodesOutput,
} from './dtos/search-episode.dto';
import { EpisodeInput, EpisodeOutput } from './dtos/episode.dto';
import {
  SearchChannelsInput,
  SearchChannelsOutput,
} from './dtos/search-channel.dto';
import { Review } from './entities/review.entity';
import {
  CreateReviewInput,
  CreateReviewOutput,
} from './dtos/create-review.dto';
import {
  SearchReviewsInput,
  SearchReviewsOutput,
} from './dtos/search-reviews.dto';

@Resolver(() => Channel)
export class ChannelsResolver {
  constructor(private readonly channelsService: ChannelsService) {}

  @Query((returns) => MyChannelOutput)
  @Role([UserRole.Artist])
  myChannel(@AuthUser() artist: User): Promise<MyChannelOutput> {
    return this.channelsService.getMyChannel(artist);
  }

  @Query((returns) => ChannelOutput)
  channel(@Args('input') channelInput: ChannelInput): Promise<ChannelOutput> {
    return this.channelsService.getChannel(channelInput);
  }

  @Query((returns) => SearchChannelsOutput)
  searchChannels(
    @Args('input') searchChannelsInput: SearchChannelsInput,
  ): Promise<SearchChannelsOutput> {
    return this.channelsService.searchChannels(searchChannelsInput);
  }

  @Mutation((returns) => EditChannelOutput)
  @Role([UserRole.Artist])
  editChannel(
    @AuthUser() artist: User,
    @Args('input') editChannelInput: EditChannelInput,
  ): Promise<EditChannelOutput> {
    return this.channelsService.editChannel(artist, editChannelInput);
  }
}

@Resolver(() => Episode)
export class EpisodesResolver {
  constructor(private readonly channelsService: ChannelsService) {}

  @Query((returns) => EpisodesOutput)
  allEpisodes(): Promise<EpisodesOutput> {
    return this.channelsService.getAllEpisodes();
  }

  @Query((returns) => EpisodeOutput)
  episode(@Args('input') episodeInput: EpisodeInput): Promise<EpisodeOutput> {
    return this.channelsService.getEpisode(episodeInput);
  }

  @Query((returns) => EpisodesOutput)
  episodes(
    @Args('input') episodesInput: EpisodesInput,
  ): Promise<EpisodesOutput> {
    return this.channelsService.getEpisodes(episodesInput);
  }

  @Query((returns) => SearchEpisodesOutput)
  searchEpisodes(
    @Args('input') searchEpisodesInput: SearchEpisodesInput,
  ): Promise<SearchEpisodesOutput> {
    return this.channelsService.searchEpisodes(searchEpisodesInput);
  }

  @Mutation((returns) => CreateEpisodeOutput)
  @Role([UserRole.Artist])
  createEpisode(
    @Args('input') createEpisodeInput: CreateEpisodeInput,
  ): Promise<CreateEpisodeOutput> {
    return this.channelsService.createEpisode(createEpisodeInput);
  }
}

@Resolver(() => Review)
export class ReviewsResolver {
  constructor(private readonly channelsService: ChannelsService) {}

  @Mutation((returns) => CreateReviewOutput)
  @Role([UserRole.Listener])
  createReview(
    @AuthUser() reviewer: User,
    @Args('input') createReviewInput: CreateReviewInput,
  ): Promise<CreateReviewOutput> {
    return this.channelsService.createReview(reviewer, createReviewInput);
  }

  @Query((returns) => SearchReviewsOutput)
  searchReviews(
    @Args('input') searchReviewsInput: SearchReviewsInput,
  ): Promise<SearchReviewsOutput> {
    return this.channelsService.searchReviews(searchReviewsInput);
  }
}
