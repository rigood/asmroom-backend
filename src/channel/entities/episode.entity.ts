import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { IsString, Length } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Channel } from './channel.entity';
import { Review } from './review.entity';

@Entity()
@InputType('EpisodeInputType', { isAbstract: true })
@ObjectType()
export class Episode extends CoreEntity {
  @Column()
  @Field((type) => String)
  @IsString()
  @Length(2, 100)
  title: string;

  @Column({ default: '' })
  @Field((type) => String, { defaultValue: '' })
  @IsString()
  @Length(0, 500)
  description: string;

  @Column()
  @Field((type) => String)
  @IsString()
  youtubeId: string;

  @ManyToOne(() => Channel, (channel) => channel.episodes, {
    onDelete: 'CASCADE',
  })
  @Field((type) => Channel)
  channel: Channel;

  @OneToMany(() => Review, (review) => review.episode)
  @Field((type) => [Review])
  reviews: Review[];
}
