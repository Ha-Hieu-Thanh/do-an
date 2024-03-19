import { HttpStatus } from '@nestjs/common';
import { ApiResponseOptions } from '@nestjs/swagger';

export const listWikiProjectSchema: ApiResponseOptions = {
  status: HttpStatus.OK,
  description: 'Response get list wiki project',
  schema: {
    example: {
      hasMore: false,
      pageIndex: 1,
      totalPages: 1,
      totalItems: 1,
      data: [
        {
          id: 1,
          subject: 'test wiki',
          content: 'lalalallalallall',
          projectId: 29,
          status: 1,
          createdBy: 2,
          updatedBy: null,
          createdAt: '2023-09-25T08:30:50.763Z',
          updatedAt: '2023-09-25T08:30:50.763Z',
        },
      ],
    },
  },
};

export const detailWikiProjectSchema: ApiResponseOptions = {
  status: HttpStatus.OK,
  description: 'Response get detail wiki project',
  schema: {
    example: {
      data: {
        id: 1,
        subject: 'test wiki',
        content: 'lalalallalallall',
        projectId: 29,
        status: 1,
        type: 2,
        createdBy: 2,
        updatedBy: null,
        createdAt: '2023-09-25T08:30:50.763Z',
        updatedAt: '2023-09-25T08:30:50.763Z',
      },
    },
  },
};
