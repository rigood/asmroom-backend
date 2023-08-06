import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { User } from '../entities/user.entity';

@InputType()
export class ChangePasswordInput extends PickType(User, ['password']) {}

@ObjectType()
export class ChangePasswordOutput extends CoreOutput {}
