import { HttpStatus } from '@nestjs/common';
import { ApiResponseOptions } from '@nestjs/swagger';

export const LoginCmsResponseSchema: ApiResponseOptions = {
  status: HttpStatus.OK,
  description: 'Response login example',
  schema: {
    example: {
      data: {
        token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidG9rZW5UeXBlIjoiQUNDRVNTX1RPS0VOIiwiaWF0IjoxNjY3OTc4MTkyLCJleHAiOjE2NzA1NzAxOTJ9.8uZTQFXvTje_4_326CABUlGDj4BpFmkZ_rDMFAIbPaU',
        refreshToken:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidG9rZW5UeXBlIjoiUkVGUkVTSF9UT0tFTiIsImlhdCI6MTY2Nzk3NjUzMywiZXhwIjoxNjcwNTY4NTMzfQ.PNsVWPXRowE7aOHPROLoxIUxjgrz8IKRzOjyQzxQ1A0',
      },
    },
  },
};

export const RequestAccessTokenSchema: ApiResponseOptions = {
  status: HttpStatus.OK,
  description: 'Response login example',
  schema: {
    example: {
      data: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZUlkIjoxLCJ1c2VyVHlwZSI6IlNVUEVSX0FETUlOIiwiaWF0IjoxNjcwNDY1MTE1LCJleHAiOjE2NzMwNTcxMTV9.dwSE0lmdCSiK5OLIU3FxsKBmiPvKpXiKnbUZpQ4uKLc',
    },
  },
};
