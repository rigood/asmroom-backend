import { v4 as uuidv4 } from 'uuid';
import { Entity, Column, OneToOne, JoinColumn, BeforeInsert } from 'typeorm';
import { InputType, ObjectType, Field } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { User } from './user.entity';

@Entity()
@InputType({ isAbstract: true })
@ObjectType()
export class Verification extends CoreEntity {
  @Column()
  @Field((type) => String)
  code: string;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @Column()
  userId: number;

  @BeforeInsert()
  createCode(): void {
    this.code = uuidv4();
  }
}
