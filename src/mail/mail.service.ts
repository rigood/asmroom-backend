import fetch from 'node-fetch';
import * as FormData from 'form-data';
import { Injectable, Inject } from '@nestjs/common';
import { MailModuleOptions, EmailVar } from './mail.interfaces';
import { CONFIG_OPTIONS } from 'src/common/common.constants';

@Injectable()
export class MailService {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: MailModuleOptions,
  ) {}

  private async sendEmail(
    subject: string,
    toEmail: string,
    template: string,
    emailVars: EmailVar[],
  ) {
    const form = new FormData();
    form.append('from', `ASMRoom <mailgun@asmroom.com>`);
    form.append('to', toEmail);
    form.append('template', template);
    form.append('subject', subject);
    emailVars.forEach((emailVar) =>
      form.append(`v:${emailVar.key}`, emailVar.value),
    );

    try {
      await fetch(
        `https://api.mailgun.net/v3/${this.options.domain}/messages`,
        {
          method: 'POST',
          headers: {
            Authorization: `Basic ${Buffer.from(
              `api:${this.options.apiKey}`,
            ).toString('base64')}`,
          },
          body: form,
        },
      );
    } catch (error) {
      console.log(error);
    }
  }

  sendVerificationEmail(email: string, code: string) {
    this.sendEmail(
      'ASMRoom 회원가입 이메일 인증',
      'rigood@naver.com',
      'asmroom',
      [
        { key: 'username', value: email.split('@')[0] },
        { key: 'code', value: code },
      ],
    );
  }
}
