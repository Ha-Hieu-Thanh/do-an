import { Exception } from '@app/core/exception';
import { S3 } from '@aws-sdk/client-s3';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ErrorCustom } from 'libs/constants/enum';
import * as md5 from 'md5';
import * as Sharp from 'sharp';

@Injectable()
export class LibraryS3UploadService {
  public S3Instance: S3;
  private readonly logger = new Logger(LibraryS3UploadService.name);
  constructor(private readonly configService: ConfigService, private readonly config: ConfigService) {
    this.S3Instance = new S3({
      credentials: {
        secretAccessKey: this.configService.get('s3Upload').secretAccessKey,
        accessKeyId: this.configService.get('s3Upload').accessKeyId,
      },
      region: this.configService.get('s3Upload').region,
    });
  }

  async putImageToS3(image: Express.Multer.File | any, fileName: string) {
    await this.S3Instance.putObject({
      ACL: 'public-read',
      Body: image.buffer,
      Bucket: this.configService.get('s3Upload').bucket,
      ContentType: image.mimetype,
      Key: fileName,
    });
    return;
  }

  async putObjectS3Upload(image: Express.Multer.File | any, fileName: string, originalname: string): Promise<void> {
    await this.generateThumb(image, fileName, originalname);
    const putObjects = image['thumbs'].map((item: any) => {
      return this.S3Instance.putObject({
        ACL: 'public-read',
        Body: item.buffer,
        Bucket: this.configService.get('s3Upload').bucket,
        ContentType: image.mimetype,
        Key: item.fileName,
      });
    });
    await Promise.all(putObjects);
  }

  async generateThumb(image: Express.Multer.File | any, fileName: string, originalname: string) {
    const thumbs = this.configService.get('s3Upload').thumbs;

    for (let thumb of thumbs) {
      const [w, h] = thumb.split('x');
      let buffer = image.buffer;

      if (w && h) {
        buffer = await Sharp(buffer)
          .resize(Number(w), Number(h), {
            withoutEnlargement: true,
            fit: 'inside',
          })
          .toBuffer();

        if (!image['thumbs'] || !Array.isArray(image['thumbs'])) image['thumbs'] = [];

        image['thumbs'].push({
          fileName: `${w}x${h}/${fileName}`,
          buffer,
        });
      }
    }
  }

  async uploadFiles(files: Array<Express.Multer.File>) {
    const results: any[] = [];
    for (const file of files) {
      if (file.originalname.search(/\.(jpe?g|png|mp4)$/gi) === -1) {
        throw new Exception(ErrorCustom.Invalid_Input);
      }

      const arr_ext = (file.originalname || '').split('.');
      const originalName = md5(file.originalname);
      const md5Name = arr_ext.length ? `${originalName}.${arr_ext[arr_ext.length - 1]}` : originalName;
      const fileName = `${Date.now().toString()}-${md5Name}`;

      await this.putImageToS3(file, fileName);

      if (file.originalname.search(/\.(jpe?g|png|mp4)$/gi) !== -1) {
        this.putObjectS3Upload(file, fileName, file.originalname);
      }

      results.push(fileName);
    }

    return { results, domain: this.config.get('s3Upload').domain };
  }
}
