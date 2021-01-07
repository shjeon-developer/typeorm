import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { PodcastsModule } from './podcast/podcasts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Episode } from './podcast/entities/episode.entity';
import { Podcast } from './podcast/entities/podcast.entity';

@Module({
  imports: [
    PodcastsModule,
    GraphQLModule.forRoot({ autoSchemaFile: true }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      logging: true,
      synchronize: true,
      entities: [Episode, Podcast],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
