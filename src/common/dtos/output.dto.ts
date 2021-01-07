import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType() // 핵심 graphql output 값 정의
export class CoreOutput {
  @Field((type) => String, { nullable: true })
  error?: string; // 에러 메시지

  @Field((type) => Boolean)
  ok: boolean; // 성공 여부
}
