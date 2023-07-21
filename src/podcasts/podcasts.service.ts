import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Podcast } from './entities/podcast.entity';
import { Repository } from 'typeorm';
import { CreatePodcastDto } from './dtos/create-podcast.dto';
import { UpdatePodcastDto } from './dtos/update-podcast.dto';

@Injectable()
export class PodcastsService {
  constructor(
    @InjectRepository(Podcast)
    private readonly podcasts: Repository<Podcast>,
  ) {}

  getAllPodcasts(): Promise<Podcast[]> {
    return this.podcasts.find();
  }

  createPodcast(createPodcastDto: CreatePodcastDto): Promise<Podcast> {
    const newPodcast = this.podcasts.create(createPodcastDto);
    return this.podcasts.save(newPodcast);
  }

  updatePodcast({ id, data }: UpdatePodcastDto) {
    return this.podcasts.update(id, { ...data });
  }
}
