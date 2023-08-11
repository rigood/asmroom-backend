import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from 'src/jwt/jwt.service';
import { User } from './entities/user.entity';
import { Verification } from './entities/verification.entity';
import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dtos/create-account.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { EditProfileInput, EditProfileOutput } from './dtos/edit-profile.dto';
import { VerifyEmailInput, VerifyEmailOutput } from './dtos/verify-email.dto';
import { MailService } from 'src/mail/mail.service';
import { UserProfileInput, UserProfileOutput } from './dtos/user-profile.dto';
import {
  ChangePasswordInput,
  ChangePasswordOutput,
} from './dtos/change-password.dto';
import { ChangeEmailInput, ChangeEmailOutput } from './dtos/change-email.dto';
import { PUB_SUB } from 'src/common/common.constants';
import { PubSub } from 'graphql-subscriptions';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(Verification)
    private readonly verifications: Repository<Verification>,
    private readonly mailService: MailService,
    private readonly jwtService: JwtService,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {}

  async createAccount({
    email,
    password,
    nickname,
    role,
  }: CreateAccountInput): Promise<CreateAccountOutput> {
    try {
      const userExist = await this.users.findOne({ where: { email } });

      if (userExist) {
        return { ok: false, error: `[에러] 이미 사용중인 이메일입니다.` };
      }

      const user = await this.users.save(
        this.users.create({ email, password, nickname, role }),
      );

      const verification = await this.verifications.save(
        this.verifications.create({ user }),
      );

      this.mailService.sendVerificationEmail(
        user.email,
        user.nickname,
        verification.code,
      );

      return { ok: true };
    } catch (error) {
      console.log(`⛔ [에러] [createAccount] ${error}`);
      return { ok: false, error: `[에러] 계정 생성 중 오류가 발생하였습니다.` };
    }
  }

  async verifyEmail({ code }: VerifyEmailInput): Promise<VerifyEmailOutput> {
    try {
      const verification = await this.verifications.findOne({
        where: { code },
        relations: ['user'],
      });

      if (!verification) {
        return { ok: false, error: `[에러] 유효하지 않은 인증입니다.` };
      }

      verification.user.verified = true;
      await this.users.save(verification.user);
      await this.verifications.delete(verification.id);

      return { ok: true };
    } catch (error) {
      console.log(`⛔ [에러] [verifyEmail] ${error}`);
      return {
        ok: false,
        error: `[에러] 이메일 인증 중 오류가 발생하였습니다.`,
      };
    }
  }

  async login({ email, password }: LoginInput): Promise<LoginOutput> {
    try {
      const user = await this.users.findOne({
        where: { email },
        select: ['password', 'id'],
      });

      if (!user) {
        return { ok: false, error: `[에러] 존재하지 않는 이메일입니다.` };
      }

      const isPasswordCorrect = await user.checkPassword(password);

      if (!isPasswordCorrect) {
        return { ok: false, error: `[에러] 비밀번호가 일치하지 않습니다.` };
      }

      const token = this.jwtService.sign(user.id);

      return { ok: true, token };
    } catch (error) {
      console.log(`⛔ [에러] [login] ${error}`);
      return {
        ok: false,
        error: `[에러] 로그인 중 오류가 발생하였습니다.`,
      };
    }
  }

  async findById({ id }: UserProfileInput): Promise<UserProfileOutput> {
    try {
      const user = await this.users.findOne({ where: { id } });

      return { ok: true, user };
    } catch (error) {
      console.log(`⛔ [에러] findById ${error}`);
      return {
        ok: false,
        error: `[에러] 사용자 프로필 확인 중 오류가 발생하였습니다.`,
      };
    }
  }

  async editProfile(
    userId: number,
    editProfileInput: EditProfileInput,
  ): Promise<EditProfileOutput> {
    try {
      await this.users.update({ id: userId }, { ...editProfileInput });

      return { ok: true };
    } catch (error) {
      console.log(`⛔ [에러] editProfile ${error}`);
      return {
        ok: false,
        error: `[에러] 프로필 수정 중 오류가 발생하였습니다.`,
      };
    }
  }

  async changePassword(
    userId: number,
    { password }: ChangePasswordInput,
  ): Promise<ChangePasswordOutput> {
    try {
      const user = await this.users.findOne({
        where: { id: userId },
      });

      user.password = password;

      await this.users.save(user);

      return { ok: true };
    } catch (error) {
      console.log(`⛔ [에러] changePassword ${error}`);
      return {
        ok: false,
        error: `[에러] 비밀번호 변경 중 오류가 발생하였습니다.`,
      };
    }
  }

  async changeEmail(
    userId: number,
    { email }: ChangeEmailInput,
  ): Promise<ChangeEmailOutput> {
    try {
      const user = await this.users.findOne({
        where: { id: userId },
      });

      if (!user.verified) {
        await this.verifications.delete({ userId });
      }

      user.verified = false;
      user.email = email;

      const verification = await this.verifications.save(
        this.verifications.create({ user }),
      );

      this.mailService.sendVerificationEmail(
        email,
        user.nickname,
        verification.code,
      );

      await this.users.save(user);

      return { ok: true };
    } catch (error) {
      console.log(`⛔ [에러] changeEmail ${error}`);
      return {
        ok: false,
        error: `[에러] 이메일 변경 중 오류가 발생하였습니다.`,
      };
    }
  }
}
