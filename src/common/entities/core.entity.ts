import { Field, ObjectType } from '@nestjs/graphql';
import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType() // 핵심 엔티티 속성 정의
export class CoreEntity {
  @PrimaryGeneratedColumn()
  @Field((type) => Number)
  id: number; // 고유키

  @CreateDateColumn()
  @Field((type) => Date)
  createdAt: Date; // 생성일

  @UpdateDateColumn()
  @Field((type) => Date)
  updatedAt: Date; // 수정일
}
