import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Channel } from './entities/channel.entity';
import { Episode } from './entities/episode.entity';
import { Review } from './entities/review.entity';
import { ChannelsService } from './channel.service';
import {
  ChannelsResolver,
  EpisodesResolver,
  ReviewsResolver,
} from './channel.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Channel, Episode, Review])],
  providers: [
    ChannelsService,
    ChannelsResolver,
    EpisodesResolver,
    ReviewsResolver,
  ],
})
export class ChannelModule {}
