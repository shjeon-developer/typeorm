import { Episode } from './episode.entity';
import { ObjectType, Field, InputType } from '@nestjs/graphql';
import { IsString, IsNumber } from 'class-validator';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@InputType('PodcastInput', { isAbstract: true })
@ObjectType()
@Entity()
export class Podcast {
  @Field((_) => Number)
  @IsNumber()
  @PrimaryGeneratedColumn()
  id: number;

  @Field((_) => String)
  @IsString()
  @Column()
  title: string;

  @Field((_) => String)
  @IsString()
  @Column()
  category: string;

  @Field((_) => Number)
  @IsNumber()
  @Column()
  rating: number;

  @Field((_) => [Episode], { nullable: true })
  @OneToMany((type) => Episode, (episode) => episode.owner)
  episodes: Episode[];
}
