import { InputType, ObjectType, Field, Int } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Channel, Category } from '../entities/channel.entity';

@InputType()
export class SearchChannelsInput {
  @Field((type) => Category, { nullable: true })
  category?: Category;
}

@ObjectType()
export class SearchChannelsOutput extends CoreOutput {
  @Field((type) => [Channel], { nullable: true })
  channels?: Channel[];

  @Field((type) => Int, { nullable: true })
  totalCount?: number;
}
