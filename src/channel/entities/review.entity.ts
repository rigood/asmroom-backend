import { Entity, Column, ManyToOne } from 'typeorm';
import { Field, InputType, ObjectType, Int } from '@nestjs/graphql';
import { IsString, IsNumber, Length, Min, Max } from 'class-validator';

import { CoreEntity } from 'src/common/entities/core.entity';
import { Episode } from './episode.entity';
import { User } from 'src/users/entities/user.entity';

@Entity()
@InputType('ReviewInputType', { isAbstract: true })
@ObjectType()
export class Review extends CoreEntity {
  @Column()
  @Field((type) => String)
  @IsString()
  @Length(1, 500)
  text: string;

  @Column()
  @Field((type) => Int)
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @ManyToOne(() => Episode, (episode) => episode.reviews, {
    onDelete: 'CASCADE',
  })
  @Field((type) => Episode)
  episode: Episode;

  @Column()
  @Field(() => Int)
  episodeId: number;

  @ManyToOne(() => User, (user) => user.reviews, { onDelete: 'CASCADE' })
  @Field((type) => User)
  reviewer: User;

  @Column()
  @Field(() => Int)
  reviewerId: number;
}
