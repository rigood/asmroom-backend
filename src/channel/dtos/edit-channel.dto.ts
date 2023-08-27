import {
  InputType,
  ObjectType,
  Field,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { Channel } from '../entities/channel.entity';
import { CoreOutput } from 'src/common/dtos/output.dto';

@InputType()
export class EditChannelInput extends PartialType(
  PickType(Channel, ['name', 'description', 'category', 'photo']),
) {}

@ObjectType()
export class EditChannelOutput extends CoreOutput {}
