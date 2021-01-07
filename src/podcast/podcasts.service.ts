import { Injectable } from '@nestjs/common';
import { CreateEpisodeDto } from './dtos/create-episode.dto';
import { CreatePodcastDto } from './dtos/create-podcast.dto';
import { UpdateEpisodeDto } from './dtos/update-episode.dto';
import { UpdatePodcastDto } from './dtos/update-podcast.dto';
import { Episode } from './entities/episode.entity';
import { Podcast } from './entities/podcast.entity';
import { CoreOutput } from './dtos/output.dto';
import {
  PodcastOutput,
  EpisodesOutput,
  EpisodesSearchInput,
} from './dtos/podcast.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PodcastsService {
  constructor(
    @InjectRepository(Podcast)
    private readonly podcasts: Repository<Podcast>,
    @InjectRepository(Episode)
    private readonly episodes: Repository<Episode>,
  ) {}

  async getAllPodcasts(): Promise<Podcast[]> {
    return await this.podcasts.find({ relations: ['episodes'] });
  }

  async createPodcast({
    title,
    category,
  }: CreatePodcastDto): Promise<CoreOutput> {
    try {
      await this.podcasts.save(
        this.podcasts.create({ title, category, rating: 0, episodes: [] }),
      );

      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error: 'Not created Podcast',
      };
    }
  }

  async getPodcast(id: number): Promise<PodcastOutput> {
    const podcast = await this.podcasts.findOne(id, {
      relations: ['episodes'],
    });
    if (!podcast) {
      return {
        ok: false,
        error: `${id} id podcast doesn't exist!`,
      };
    }
    return {
      ok: true,
      podcast,
    };
  }

  async deletePodcast(id: number): Promise<CoreOutput> {
    try {
      const { ok, error, podcast } = await this.getPodcast(id);
      if (!ok) {
        return { ok, error };
      }
      await this.podcasts.delete(podcast);
      return { ok };
    } catch (error) {
      return {
        ok: false,
        error: 'not delete podcast',
      };
    }
  }

  async updatePodcast({ id, ...rest }: UpdatePodcastDto): Promise<CoreOutput> {
    const { ok, error } = await this.getPodcast(id);
    if (!ok) {
      return { ok, error };
    }
    await this.podcasts.update(id, { ...rest });
    return { ok };
  }

  async getEpisodes(podcastId: number): Promise<EpisodesOutput> {
    const { podcast, ok, error } = await this.getPodcast(podcastId);
    if (!ok) {
      return { ok, error };
    }
    return { ok: true, episodes: podcast.episodes };
  }

  async createEpisode({
    id: podcastId,
    title,
    category,
    rating,
  }: CreateEpisodeDto): Promise<CoreOutput> {
    try {
      const { podcast, ok, error } = await this.getPodcast(podcastId);
      if (!ok) {
        return { ok, error };
      }
      const episode = await this.episodes.create({ title, category, rating });
      episode.owner = podcast;
      console.log(episode);

      await this.episodes.save(episode);

      return { ok: true };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }

  async updateEpisode({
    podcastId,
    episodeId,
    ...rest
  }: UpdateEpisodeDto): Promise<CoreOutput> {
    try {
      const { podcast, error, ok } = await this.getPodcast(podcastId);
      if (!ok) {
        return { ok, error };
      }
      if (!podcast.episodes.find((episode) => episode.id === episodeId)) {
        return {
          ok: false,
          error: `${episodeId} episode not found`,
        };
      }

      await this.episodes.update(episodeId, { ...rest });

      return { ok: true };
    } catch (error) {}
  }

  async deleteEpisode({
    podcastId,
    episodeId,
  }: EpisodesSearchInput): Promise<CoreOutput> {
    try {
      const { podcast, error, ok } = await this.getPodcast(podcastId);
      if (!ok) {
        return { ok, error };
      }

      const episode = podcast.episodes.find(
        (episode) => episode.id === episodeId,
      );

      if (!episode) {
        return {
          ok: false,
          error: 'not found episode',
        };
      }

      await this.episodes.delete(episode);

      return { ok: true };
    } catch (error) {
      return {
        ok: false,
        error: `delete fail`,
      };
    }
  }
}
