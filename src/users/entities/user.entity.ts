import * as bcrypt from 'bcrypt';
import {
  Entity,
  Column,
  BeforeInsert,
  BeforeUpdate,
  OneToOne,
  OneToMany,
} from 'typeorm';
import {
  InputType,
  ObjectType,
  Field,
  registerEnumType,
} from '@nestjs/graphql';
import { IsEmail, IsString, IsBoolean, IsEnum, Length } from 'class-validator';
import { InternalServerErrorException } from '@nestjs/common';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Channel } from 'src/channel/entities/channel.entity';
import { Review } from 'src/channel/entities/review.entity';

export enum UserRole {
  Artist = 'Artist',
  Listener = 'Listener',
}

registerEnumType(UserRole, { name: 'UserRole' });

@Entity()
@InputType({ isAbstract: true })
@ObjectType()
export class User extends CoreEntity {
  @Column({ unique: true })
  @Field((type) => String)
  @IsEmail()
  email: string;

  @Column({ select: false })
  @Field((type) => String)
  @IsString()
  @Length(4, 16)
  password: string;

  @Column()
  @Field((type) => String)
  @IsString()
  @Length(2, 20)
  nickname: string;

  @Column({ type: 'enum', enum: UserRole })
  @Field((type) => UserRole)
  @IsEnum(UserRole)
  role: UserRole;

  @Column({ default: false })
  @Field((type) => Boolean)
  @IsBoolean()
  verified: boolean;

  @Column({ nullable: true })
  @Field((type) => String, { nullable: true })
  @IsString()
  photo?: string;

  @OneToOne(() => Channel, (channel) => channel.artist)
  @Field((type) => Channel)
  channel: Channel;

  @Column({ nullable: true })
  @Field((type) => Number, { nullable: true })
  channelId?: number;

  @OneToMany(() => Review, (review) => review.episode)
  @Field((type) => [Review])
  reviews: Review[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if (this.password) {
      try {
        this.password = await bcrypt.hash(this.password, 10);
      } catch (error) {
        console.log(`⛔ [에러] [hashPassword] ${error}`);
        throw new InternalServerErrorException();
      }
    }
  }

  async checkPassword(passwordInput: string): Promise<boolean> {
    try {
      const ok = await bcrypt.compare(passwordInput, this.password);
      return ok;
    } catch (error) {
      console.log(`⛔ [에러] [checkPassword] ${error}`);
      throw new InternalServerErrorException();
    }
  }
}
