import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Verification } from './entities/verification.entity';
import { Channel } from 'src/channel/entities/channel.entity';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Verification, Channel])],
  providers: [UsersResolver, UsersService],
  exports: [UsersService],
})
export class UsersModule {}
