import { IsNotEmpty, IsString } from 'class-validator';

export class RequestAccessTokenDto {
  /**
   * refresh token
   * @example eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZUlkIjoxLCJ1c2VyVHlwZSI6IlNVUEVSX0FETUlOIiwiaWF0IjoxNjcwNDY1MTE1LCJleHAiOjE2NzMwNTcxMTV9.dwSE0lmdCSiK5OLIU3FxsKBmiPvKpXiKnbUZpQ4uKLc
   */
  @IsNotEmpty()
  @IsString()
  refreshToken: string;
}
