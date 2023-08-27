import {
  Controller,
  Post,
  UseInterceptors,
  Body,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import * as AWS from 'aws-sdk';
import { BodyDto } from './dtos/body.dto';

const BUCKET_NAME = 'rigoodaws-asmroom';

@Controller('upload')
export class UploadController {
  constructor(private readonly configService: ConfigService) {}

  @Post('')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @Body() { folderName }: BodyDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1000000 }),
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    AWS.config.update({
      credentials: {
        accessKeyId: this.configService.get('AWS_KEY'),
        secretAccessKey: this.configService.get('AWS_SECRET'),
      },
    });
    try {
      const objectName =
        folderName + '/' + `${Date.now()}` + '_' + file.originalname;

      await new AWS.S3()
        .putObject({
          Body: file.buffer,
          Bucket: BUCKET_NAME,
          Key: objectName,
          ACL: 'public-read',
        })
        .promise();

      const url = `https://${BUCKET_NAME}.s3.amazonaws.com/${objectName}`;

      return { url };
    } catch (error) {
      console.log(`⛔ [에러] uploadFile ${error}`);
      return null;
    }
  }
}
