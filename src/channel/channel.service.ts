import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Channel } from './entities/channel.entity';
import { Episode } from './entities/episode.entity';
import { User } from 'src/users/entities/user.entity';
import { MyChannelOutput } from './dtos/myChannel.dto';
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
import {
  CreateReviewInput,
  CreateReviewOutput,
} from './dtos/create-review.dto';
import { Review } from './entities/review.entity';
import {
  SearchReviewsInput,
  SearchReviewsOutput,
} from './dtos/search-reviews.dto';

@Injectable()
export class ChannelsService {
  constructor(
    @InjectRepository(Channel) private readonly channels: Repository<Channel>,
    @InjectRepository(Episode) private readonly episodes: Repository<Episode>,
    @InjectRepository(Review) private readonly reviews: Repository<Review>,
  ) {}

  async getMyChannel(artist: User): Promise<MyChannelOutput> {
    try {
      const channel = await this.channels.findOne({
        where: { artistId: artist.id },
        relations: ['episodes'],
      });

      return {
        ok: true,
        channel,
      };
    } catch (error) {
      console.log(`⛔ [에러] [myChannel] ${error}`);
      return {
        ok: false,
        error: `[에러] 내 채널 정보를 불러오는 중에 오류가 발생했습니다.`,
      };
    }
  }

  async getChannel({ channelId }: ChannelInput): Promise<ChannelOutput> {
    try {
      const channel = await this.channels.findOne({
        where: { id: channelId },
        relations: ['episodes'],
      });

      if (!channel) {
        return {
          ok: false,
          error: `해당 채널이 존재하지 않습니다. (채널ID: ${channelId})`,
        };
      }

      return {
        ok: true,
        channel,
      };
    } catch (error) {
      console.log(`⛔ [에러] [channel] ${error}`);
      return {
        ok: false,
        error: `[에러] 채널 정보를 불러오는 중에 오류가 발생했습니다.`,
      };
    }
  }

  async searchChannels({
    category,
  }: SearchChannelsInput): Promise<SearchChannelsOutput> {
    try {
      const [channels, totalCount] = await this.channels.findAndCount({
        where: {
          ...(category !== null && { category }),
        },
        order: {
          createdAt: 'DESC',
        },
      });

      return {
        ok: true,
        channels,
        totalCount,
      };
    } catch (error) {
      console.log(`⛔ [에러] [searchChannels] ${error}`);
      return {
        ok: false,
        error: `[에러] 채널 정보를 불러오는 중에 오류가 발생했습니다.`,
      };
    }
  }

  async editChannel(
    artist: User,
    editChannelInput: EditChannelInput,
  ): Promise<EditChannelOutput> {
    try {
      const { ok, error, channel } = await this.getMyChannel(artist);

      if (!ok) {
        return { ok, error };
      }

      await this.channels.save([{ id: channel.id, ...editChannelInput }]);

      return { ok: true };
    } catch (error) {
      console.log(`⛔ [에러] [editChannel] ${error}`);
      return {
        ok: false,
        error: `[에러] 내 채널 정보를 수정 중에 오류가 발생했습니다.`,
      };
    }
  }

  async getAllEpisodes(): Promise<EpisodesOutput> {
    try {
      const episodes = await this.episodes.find();

      return {
        ok: true,
        episodes,
      };
    } catch (error) {
      console.log(`⛔ [에러] [getAllEpisodes] ${error}`);
      return {
        ok: false,
        error: `[에러] 에피소드 목록을 불러오는 중에 오류가 발생했습니다.`,
      };
    }
  }

  async getEpisode({ episodeId }: EpisodeInput): Promise<EpisodeOutput> {
    try {
      const episode = await this.episodes.findOne({
        where: { id: episodeId },
        relations: ['channel', 'reviews'],
      });

      if (!episode) {
        return {
          ok: false,
          error: `해당 에피소드가 존재하지 않습니다. (에피소드ID: ${episodeId})`,
        };
      }

      return {
        ok: true,
        episode,
      };
    } catch (error) {
      console.log(`⛔ [에러] [getEpisode] ${error}`);
      return {
        ok: false,
        error: `[에러] 에피소드를 불러오는 중에 오류가 발생했습니다.`,
      };
    }
  }

  async getEpisodes({ channelId }: EpisodesInput): Promise<EpisodesOutput> {
    try {
      const { channel, ok, error } = await this.getChannel({ channelId });

      if (!ok) {
        return { ok, error };
      }

      return {
        ok: true,
        episodes: channel.episodes,
      };
    } catch (error) {
      console.log(`⛔ [에러] [getEpisodes] ${error}`);
      return {
        ok: false,
        error: `[에러] 에피소드 목록을 불러오는 중에 오류가 발생했습니다.`,
      };
    }
  }

  async searchEpisodes({
    query,
  }: SearchEpisodesInput): Promise<SearchEpisodesOutput> {
    try {
      const [episodes, totalCount] = await this.episodes.findAndCount({
        where: {
          title: ILike(`%${query}%`),
        },
        order: {
          createdAt: 'DESC',
        },
      });

      return {
        ok: true,
        episodes,
        totalCount,
      };
    } catch (error) {
      console.log(`⛔ [에러] [searchEpisodes] ${error}`);
      return {
        ok: false,
        error: `[에러] 에피소드를 검색하는 중에 오류가 발생했습니다.`,
      };
    }
  }

  async createEpisode({
    channelId,
    title,
    description,
    youtubeId,
  }: CreateEpisodeInput): Promise<CreateEpisodeOutput> {
    try {
      const { channel, ok, error } = await this.getChannel({ channelId });

      if (!ok) {
        return { ok, error };
      }

      const newEpisode = this.episodes.create({
        title,
        description,
        youtubeId,
      });

      newEpisode.channel = channel;

      await this.episodes.save(newEpisode);

      return {
        ok: true,
      };
    } catch (error) {
      console.log(`⛔ [에러] [createEpisode] ${error}`);
      return {
        ok: false,
        error: `[에러] 에피소드를 생성하는 중에 오류가 발생했습니다.`,
      };
    }
  }

  async createReview(
    reviewer: User,
    { episodeId, text, rating }: CreateReviewInput,
  ): Promise<CreateReviewOutput> {
    try {
      const episode = await this.episodes.findOne({
        where: { id: episodeId },
      });

      if (!episode) {
        return {
          ok: false,
          error: `해당 에피소드가 존재하지 않습니다. (에피소드ID: ${episodeId})`,
        };
      }

      const newReview = this.reviews.create({
        text,
        rating,
      });

      newReview.episode = episode;
      newReview.reviewer = reviewer;

      await this.reviews.save(newReview);

      return {
        ok: true,
      };
    } catch (error) {
      console.log(`⛔ [에러] [createReview] ${error}`);
      return {
        ok: false,
        error: `[에러] 리뷰 생성 중에 오류가 발생했습니다.`,
      };
    }
  }

  async searchReviews(
    searchReviewsInput: SearchReviewsInput,
  ): Promise<SearchReviewsOutput> {
    try {
      const episodeId = searchReviewsInput.episodeId;

      if (episodeId) {
        const [reviews, totalCount] = await this.reviews.findAndCount({
          where: { episodeId },

          relations: ['reviewer'],
        });

        return {
          ok: true,
          reviews,
          totalCount,
        };
      }

      const reviewerId = searchReviewsInput.reviewerId;

      if (reviewerId) {
        const [reviews, totalCount] = await this.reviews.findAndCount({
          where: { reviewerId },

          relations: ['reviewer'],
        });

        return {
          ok: true,
          reviews,
          totalCount,
        };
      }

      if (!episodeId || !reviewerId) {
        const [reviews, totalCount] = await this.reviews.findAndCount({
          relations: ['reviewer'],
        });
        return {
          ok: false,
          reviews,
          totalCount,
        };
      }
    } catch (error) {
      console.log(`⛔ [에러] [searchReviews] ${error}`);
      return {
        ok: false,
        error: `[에러] 리뷰를 불러오는 중에 오류가 발생했습니다.`,
      };
    }
  }
}
