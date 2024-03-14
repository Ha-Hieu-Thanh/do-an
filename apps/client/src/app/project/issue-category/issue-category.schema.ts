import { ApiResponseOptions } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';

export const listProjectIssueCategorySchema: ApiResponseOptions = {
  status: HttpStatus.OK,
  description: 'Response Create Project',
  schema: {
    example: {
      hasMore: false,
      pageIndex: 1,
      totalPages: 1,
      totalItems: 2,
      data: [
        {
          id: 2,
          name: 'New category 2',
          issueCount: 0,
          description: null,
          order: 2,
        },
        {
          id: 1,
          name: 'New category',
          issueCount: 0,
          description: null,
          order: 1,
        },
      ],
    },
  },
};

export const detailProjectIssueCategorySchema: ApiResponseOptions = {
  status: HttpStatus.OK,
  description: 'Response Create Project',
  schema: {
    example: {
      hasMore: false,
      pageIndex: 1,
      totalPages: 1,
      totalItems: 2,
      data: [
        {
          id: 2,
          name: 'New category 2',
          issueCount: 0,
          description: null,
          order: 2,
        },
        {
          id: 1,
          name: 'New category',
          issueCount: 0,
          description: null,
          order: 1,
        },
      ],
    },
  },
};
