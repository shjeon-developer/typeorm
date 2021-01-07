import { InputType, ObjectType, Field } from '@nestjs/graphql';
import { IsNumber } from 'class-validator';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { Podcast } from './podcast.entity';

@InputType('EpisodeInput', { isAbstract: true })
@ObjectType()
@Entity()
export class Episode {
  @Field((_) => Number)
  @PrimaryGeneratedColumn()
  id: number;

  @Field((_) => String)
  @Column()
  title: string;

  @Field((_) => String)
  @Column()
  category: string;

  @Field((_) => Number)
  @IsNumber()
  @Column()
  rating: number;

  @ManyToOne((type) => Podcast, (podcast) => podcast.episodes)
  owner: Podcast;
}
