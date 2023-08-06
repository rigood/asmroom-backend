import fetch from 'node-fetch';
import * as FormData from 'form-data';
import { Injectable, Inject } from '@nestjs/common';
import { CONFIG_OPTIONS } from 'src/common/common.constants';
import { MailModuleOptions } from './mail.interfaces';

@Injectable()
export class MailService {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: MailModuleOptions,
  ) {}

  async sendEmail(
    subject: string,
    toEmail: string,
    template: string,
    emailVars: { [key: string]: string },
  ): Promise<void> {
    const form = new FormData();
    form.append('subject', subject);
    form.append('from', `ASMRoom <mailgun@asmroom.com>`);
    form.append('to', toEmail);
    form.append('template', template);
    Object.keys(emailVars).forEach((key) => {
      form.append(`v:${key}`, emailVars[key]);
    });

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
      console.log(`⛔ [에러] [sendEmail] ${error}`);
    }
  }

  sendVerificationEmail(email: string, nickname: string, code: string) {
    this.sendEmail('ASMRoom 이메일 인증', 'rigood@naver.com', 'asmroom', {
      nickname,
      code,
    });
  }
}
