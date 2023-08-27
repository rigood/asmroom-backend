import { ObjectType, Field } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Channel } from '../entities/channel.entity';

@ObjectType()
export class MyChannelOutput extends CoreOutput {
  @Field((type) => Channel, { nullable: true })
  channel?: Channel;
}
