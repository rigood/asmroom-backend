import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateAccountInput } from './dtos/create-account.dto';
import { LoginInput } from './dtos/login.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
  ) {}

  async createAccount({
    email,
    password,
    role,
  }: CreateAccountInput): Promise<{ ok: boolean; error?: string }> {
    try {
      const userExists = await this.users.findOne({ where: { email } });

      if (userExists) {
        return { ok: false, error: `[에러] 사용중인 이메일입니다.` };
      }

      await this.users.save(this.users.create({ email, password, role }));
      return { ok: true };
    } catch (error) {
      return { ok: false, error: `[에러] 계정을 생성할 수 없습니다.` };
    }
  }

  async login({
    email,
    password,
  }: LoginInput): Promise<{ ok: boolean; error?: string; token?: string }> {
    try {
      const user = await this.users.findOne({ where: { email } });
      if (!user) {
        return { ok: false, error: `[에러] 존재하지 않는 이메일입니다.` };
      }

      const isPasswordCorrect = await user.checkPassword(password);
      if (!isPasswordCorrect) {
        return { ok: false, error: `[에러] 비밀번호가 일치하지 않습니다.` };
      }

      return { ok: true, token: 'test token' };
    } catch (error) {
      return { ok: false, error };
    }
  }
}
