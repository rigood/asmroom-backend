import { Module } from '@nestjs/common';
import * as Joi from 'joi';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { User } from './users/entities/user.entity';
import { Verification } from './users/entities/verification.entity';
import { Channel } from './channel/entities/channel.entity';
import { Episode } from './channel/entities/episode.entity';
import { JwtModule } from './jwt/jwt.module';
import { MailModule } from './mail/mail.module';
import { UploadModule } from './upload/upload.module';
import { CommonModule } from './common/common.module';
import { ChannelModule } from './channel/channel.module';
import { Context } from 'graphql-ws';
import { TOKEN_KEY } from './common/common.constants';
import { Review } from './channel/entities/review.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env.test',
      ignoreEnvFile: process.env.NODE_ENV === 'production',
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('dev', 'production', 'test').required(),
        DB_HOST: Joi.string(),
        DB_PORT: Joi.string(),
        DB_USERNAME: Joi.string(),
        DB_PASSWORD: Joi.string(),
        DB_DATABASE: Joi.string(),
        PRIVATE_KEY: Joi.string().required(),
        MAILGUN_API_KEY: Joi.string().required(),
        MAILGUN_DOMAIN: Joi.string().required(),
        AWS_KEY: Joi.string().required(),
        AWS_SECRET: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      ...(process.env.DATABASE_URL
        ? { url: process.env.DATABASE_URL }
        : {
            host: process.env.DB_HOST,
            port: +process.env.DB_PORT,
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
          }),
      synchronize: process.env.NODE_ENV !== 'production',
      logging: process.env.NODE_ENV === 'dev',
      entities: [User, Verification, Channel, Episode, Review],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      playground: process.env.NODE_ENV !== 'production',
      subscriptions: {
        'graphql-ws': {
          onConnect: (context: Context) => {
            const { connectionParams, extra } = context;
            extra['token'] = connectionParams[TOKEN_KEY];
          },
        },
      },
      context: ({ req, extra }) => {
        return { token: req ? req.headers[TOKEN_KEY] : extra.token };
      },
    }),
    MailModule.forRoot({
      apiKey: process.env.MAILGUN_API_KEY,
      domain: process.env.MAILGUN_DOMAIN,
    }),
    JwtModule.forRoot({
      privateKey: process.env.PRIVATE_KEY,
    }),
    UsersModule,
    AuthModule,
    UploadModule,
    CommonModule,
    ChannelModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
