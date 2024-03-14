require('dotenv').config();
import { DataSource } from 'typeorm';
export default (): {} => ({
  nodeEnv: process.env.NODE_ENV,
  portClient: Number(process.env.SERVER_PORT_CLIENT) || 3002,
  appName: String(process.env.APP_NAME),
  domainUser: String(process.env.DOMAIN_USER),
  redis: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    db: Number(process.env.REDIS_DB),
    password: process.env.REDIS_PASSWORD,
    ttl: Number(process.env.REDIS_TTL),
  },
  auth: {
    secretOrKey: process.env.JWT_SECRET_KEY,
    accessTokenExpiredIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN || '10d',
    refreshTokenExpiredIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN || '30d',
    saltRound: Number(process.env.BCRYPT_HASH_ROUNDS),
  },
  nodemailer: {
    host: process.env.NODEMAILER_HOST,
    port: Number(process.env.NODEMAILER_PORT),
    user: process.env.NODEMAILER_USER,
    password: process.env.NODEMAILER_PASSWORD,
    from: process.env.NODEMAILER_FROM,
  },
  queue: {
    prefix: process.env.QUEUE_PREFIX || '',
    delayPurchaseNft: Number(process.env.DELAY_TIME_PURCHASE_NFT_QUEUE) || 60 * 1000 * 10,
  },
  s3Upload: {
    secretAccessKey: process.env.AWS_S3_SECRET_KEY,
    accessKeyId: process.env.AWS_S3_ACCESS_KEY,
    region: process.env.AWS_S3_REGION,
    bucket: process.env.AWS_S3_BUCKET,
    thumbs: [
      '',
      ...String(process.env.AWS_S3_THUMBS)
        .split(' ')
        .filter((item) => item),
    ],
    domain: `https://${process.env.AWS_S3_BUCKET}.s3.amazonaws.com`,
    endPointConvertMp4ToGif: process.env.END_POINT_CONVERT_MP4_TO_GIFT,
  },
  database: {
    mongodbUri: process.env.MONGODB_URI,
  },
});


export interface IConfigRedis {
  host: string;
  port: number;
  db: number;
  password: string;
  ttl: number;
}
export interface IConfigAuth {
  secretOrKey: string;
  accessTokenExpiredIn: string;
  refreshTokenExpiredIn: string;
  saltRound: number;
}

export interface IConfigNodemailer {
  host: string;
  port: number;
  user: string;
  password: string;
  from: string;
}

export interface IConfigQueue {
  prefix: string;
  delayPurchaseNft: number;
}

export interface IConfigS3Upload {
  secretAccessKey: string;
  accessKeyId: string;
  region: string;
  bucket: string;
  thumbs: string[];
  domain: string;
  endPointConvertMp4ToGif: string;
}
export interface IConfig {
  nodeEnv: string;
  portClient: number;
  appName: string;
  domainUser: string;
  typeORMOptions: typeof DataSource;
  redis: IConfigRedis;
  auth: IConfigAuth;
  nodemailer?: IConfigNodemailer;
  queue: IConfigQueue;
  s3Upload: IConfigS3Upload;
  database: {
    mongodbUri: string;
  };
}

export interface IDataTokenForgotPassword {
  email: string;
  timeStamp: number;
  userType: number;
  id: number;
  iat: number;
  exp: number;
}
