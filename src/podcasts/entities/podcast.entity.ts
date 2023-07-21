import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IsNumber, IsOptional, IsString } from 'class-validator';

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class Podcast {
  @Field(() => Number)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String)
  @Column()
  @IsString()
  title: string;

  @Field(() => String)
  @Column()
  @IsString()
  category: string;

  @Field(() => Number, { defaultValue: 0 })
  @Column({ default: 0 })
  @IsOptional()
  @IsNumber()
  rating?: number;
}
