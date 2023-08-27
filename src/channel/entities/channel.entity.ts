import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { Column, Entity, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { IsString, IsEnum, Length } from 'class-validator';
import { User } from 'src/users/entities/user.entity';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Episode } from './episode.entity';

export enum Category {
  Roleplays = 'Roleplays',
  Eating = 'Eating',
  VoiceTriggers = 'Voice Triggers',
  ObjectTriggers = 'Object Triggers',
  VisualTriggers = 'Visual Triggers',
  Ambience = 'Ambience',
  Spiritual = 'Spiritual',
  Satisfying = 'Satisfyiing',
  HowToStyle = 'How To Style',
  Etc = 'Etc',
  NoCategory = 'No Category',
}

registerEnumType(Category, { name: 'Category' });

@Entity()
@InputType('ChannelInputType', { isAbstract: true })
@ObjectType()
export class Channel extends CoreEntity {
  @Column()
  @Field(() => String)
  @IsString()
  @Length(2, 20)
  name: string;

  @Column({ type: 'enum', enum: Category, default: Category.NoCategory })
  @Field(() => Category)
  @IsEnum(Category)
  category: Category;

  @Column({ default: '' })
  @Field((type) => String, { defaultValue: '' })
  @IsString()
  @Length(0, 500)
  description: string;

  @Column({ default: '' })
  @Field((type) => String, { defaultValue: '' })
  @IsString()
  photo: string;

  @OneToOne(() => User, (user) => user.channel, { onDelete: 'CASCADE' })
  @JoinColumn()
  @Field((type) => User)
  artist: User;

  @Column()
  @Field((type) => Number)
  artistId: number;

  @OneToMany(() => Episode, (episode) => episode.channel)
  @Field((type) => [Episode])
  episodes: Episode[];
}
