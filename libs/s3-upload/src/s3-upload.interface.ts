export interface S3uploadOptions {
  secretAccessKey: string;
  accessKeyId: string;
  maxFiles: number;
  region: string;
  bucket: string;
  domain: string;
  thumbs: string[];
  endPointConvertMp4ToGif?: string;
}
