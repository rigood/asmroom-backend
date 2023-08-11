import { Resolver, Query, Mutation, Args, Subscription } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dtos/create-account.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { UserProfileInput, UserProfileOutput } from './dtos/user-profile.dto';
import { EditProfileInput, EditProfileOutput } from './dtos/edit-profile.dto';
import { VerifyEmailInput, VerifyEmailOutput } from './dtos/verify-email.dto';
import {
  ChangePasswordInput,
  ChangePasswordOutput,
} from './dtos/change-password.dto';
import { ChangeEmailInput, ChangeEmailOutput } from './dtos/change-email.dto';
import { Role } from 'src/auth/role.decorator';
import { PUB_SUB } from 'src/common/common.constants';
import { PubSub } from 'graphql-subscriptions';

@Resolver((of) => User)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {}

  @Mutation((returns) => CreateAccountOutput)
  createAccount(
    @Args('input') createAccountInput: CreateAccountInput,
  ): Promise<CreateAccountOutput> {
    return this.usersService.createAccount(createAccountInput);
  }

  @Mutation((returns) => VerifyEmailOutput)
  verifyEmail(
    @Args('input') verifyEmailInput: VerifyEmailInput,
  ): Promise<VerifyEmailOutput> {
    return this.usersService.verifyEmail(verifyEmailInput);
  }

  @Mutation((returns) => LoginOutput)
  login(@Args('input') loginInput: LoginInput): Promise<LoginOutput> {
    return this.usersService.login(loginInput);
  }

  @Query((returns) => UserProfileOutput)
  @Role(['Any'])
  userProfile(
    @Args('input') userProfileInput: UserProfileInput,
  ): Promise<UserProfileOutput> {
    return this.usersService.findById(userProfileInput);
  }

  @Mutation((returns) => EditProfileOutput)
  @Role(['Any'])
  editProfile(
    @AuthUser() authUser: User,
    @Args('input') editProfileInput: EditProfileInput,
  ): Promise<EditProfileOutput> {
    return this.usersService.editProfile(authUser.id, editProfileInput);
  }

  @Mutation((returns) => ChangePasswordOutput)
  @Role(['Any'])
  changePassword(
    @AuthUser() authUser: User,
    @Args('input') changePasswordInput: ChangePasswordInput,
  ): Promise<EditProfileOutput> {
    return this.usersService.changePassword(authUser.id, changePasswordInput);
  }

  @Mutation((returns) => ChangeEmailOutput)
  @Role(['Any'])
  changeEmail(
    @AuthUser() authUser: User,
    @Args('input') changeEmailInput: ChangeEmailInput,
  ): Promise<EditProfileOutput> {
    return this.usersService.changeEmail(authUser.id, changeEmailInput);
  }

  @Query((returns) => User)
  @Role(['Any'])
  me(@AuthUser() authUser: User) {
    return authUser;
  }

  @Subscription((returns) => String, {
    filter(payload, variables, context) {
      console.log(
        `💰 payload ${payload.sub} variables ${
          variables.userId
        } cotnext ${JSON.stringify(context.user, null, 2)}`,
      );
      return payload.sub === variables.userId;
    },
    resolve: ({ sub }) => `userId is ${sub}`,
  })
  @Role(['Any'])
  sub(@Args('userId') userId: number) {
    return this.pubSub.asyncIterator('trigger');
  }

  @Mutation((returns) => Boolean)
  async event(@Args('userId') userId: number) {
    await this.pubSub.publish('trigger', {
      sub: userId,
    });
    return true;
  }
}
