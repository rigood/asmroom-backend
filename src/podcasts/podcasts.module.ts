import { Module } from '@nestjs/common';
import { PodcastsResolver } from './podcasts.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Podcast } from './entities/podcast.entity';
import { PodcastsService } from './podcasts.service';

@Module({
  imports: [TypeOrmModule.forFeature([Podcast])],
  providers: [PodcastsResolver, PodcastsService],
})
export class PodcastsModule {}
