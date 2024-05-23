import { ApiResponseOptions } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';

export const listMembersProjectSchema: ApiResponseOptions = {
  status: HttpStatus.OK,
  description: 'Response Create Project',
  schema: {
    example: {
      hasMore: false,
      pageIndex: 1,
      totalPages: 1,
      totalItems: 1,
      data: [
        {
          userId: 2,
          projectId: 9,
          role: 1,
          status: 2,
          issueCount: 0,
          createdAt: '2023-06-27T06:04:09.265Z',
          user: {
            id: 2,
            name: null,
            avatar: null,
            email: 'hieuthanh4a2@gmail.com',
          },
        },
      ],
    },
  },
};
