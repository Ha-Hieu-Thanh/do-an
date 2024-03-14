import { ApiResponseOptions } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';
export const listProjectVersionSchema: ApiResponseOptions = {
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
          name: '1.2',
          issueCount: 0,
          startDate: '2022-11-08T17:00:00.000Z',
          endDate: '2023-11-10T17:00:00.000Z',
          description: null,
          order: 2,
        },
        {
          id: 1,
          name: '1.1',
          issueCount: 0,
          startDate: '2022-11-08T17:00:00.000Z',
          endDate: '2023-11-10T17:00:00.000Z',
          description: null,
          order: 1,
        },
      ],
    },
  },
};
export const detailProjectVersionSchema: ApiResponseOptions = {
  status: HttpStatus.OK,
  description: 'Response Create Project',
  schema: {
    example: {
      data: {
        id: 1,
        projectId: 6,
        name: '1.1',
        status: 2,
        issueCount: 0,
        startDate: '2022-11-08T17:00:00.000Z',
        endDate: '2023-11-10T17:00:00.000Z',
        description: null,
        order: 1,
        isFirst: false,
        isLast: true,
        createdBy: 2,
        updatedBy: null,
        createdAt: '2023-07-04T10:00:15.791Z',
        updatedAt: '2023-07-04T10:00:23.000Z',
      },
    },
  },
};
