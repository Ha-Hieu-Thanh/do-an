import { ApiResponseOptions } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';

export const listProjectIssueTypeSchema: ApiResponseOptions = {
  status: HttpStatus.OK,
  description: 'Response Create Project',
  schema: {
    example: {
      hasMore: false,
      pageIndex: 1,
      totalPages: 1,
      totalItems: 3,
      data: [
        {
          id: 30,
          name: 'new',
          backgroundColor: 'fffffff',
          issueCount: 0,
          description: null,
          order: 3,
        },
        {
          id: 31,
          name: 'new',
          backgroundColor: 'fffffff',
          issueCount: 0,
          description: null,
          order: 2,
        },
        {
          id: 29,
          name: 'new',
          backgroundColor: 'fffffff',
          issueCount: 0,
          description: null,
          order: 1,
        },
      ],
    },
  },
};

export const detailProjectIssueTypeSchema: ApiResponseOptions = {
  status: HttpStatus.OK,
  description: 'Response Create Project',
  schema: {
    example: {
      data: {
        id: 30,
        projectId: 7,
        name: 'new',
        status: 2,
        backgroundColor: 'fffffff',
        issueCount: 0,
        description: null,
        order: 3,
        isFirst: false,
        isLast: false,
        isDefault: false,
        createdBy: 2,
        updatedBy: null,
        createdAt: '2023-07-01T20:21:33.325Z',
        updatedAt: '2023-07-02T14:38:21.000Z',
      },
    },
  },
};
