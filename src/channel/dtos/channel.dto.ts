import { InputType, ObjectType, Field, Int } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Channel } from '../entities/channel.entity';

@InputType()
export class ChannelInput {
  @Field((type) => Int)
  channelId: number;
}

@ObjectType()
export class ChannelOutput extends CoreOutput {
  @Field((type) => Channel, { nullable: true })
  channel?: Channel;
}
