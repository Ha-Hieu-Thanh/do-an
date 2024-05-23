import { HttpStatus } from '@nestjs/common';
import { ApiResponseOptions } from '@nestjs/swagger';

export const GetMyProfileResponseSchema: ApiResponseOptions = {
  status: HttpStatus.OK,
  description: 'Response login example',
  schema: {
    example: {
      data: {
        id: 2,
        name: null,
        avatar: 'https://thanh-bucket-datn.s3.amazonaws.com/1688550208823-21e2e9daf0579180cacf07457f3eb63a.jpg',
        gender: null,
        address: null,
        birthday: null,
        email: 'hieuthanh4a2@gmail.com',
        phone: null,
        avatar50x50:
          'https://thanh-bucket-datn.s3.amazonaws.com/50x50/1688550208823-21e2e9daf0579180cacf07457f3eb63a.jpg',
        avatar400x400:
          'https://thanh-bucket-datn.s3.amazonaws.com/400x400/1688550208823-21e2e9daf0579180cacf07457f3eb63a.jpg',
        origin: 'https://thanh-bucket-datn.s3.amazonaws.com/1688550208823-21e2e9daf0579180cacf07457f3eb63a.jpg',
      },
    },
  },
};
