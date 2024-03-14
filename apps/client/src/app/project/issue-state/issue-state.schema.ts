import { ApiResponseOptions } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';

export const listProjectIssueStateSchema: ApiResponseOptions = {
  status: HttpStatus.OK,
  description: 'Response Create Project',
  schema: {
    example: {
      hasMore: false,
      pageIndex: 1,
      totalPages: 1,
      totalItems: 5,
      data: [
        {
          id: 11,
          name: 'Request',
          backgroundColor: '#ea733b',
          issueCount: 0,
          description: 'Request',
          order: 5,
        },
        {
          id: 12,
          name: 'Other',
          backgroundColor: '#3b9dbd',
          issueCount: 0,
          description: 'Other',
          order: 4,
        },
        {
          id: 13,
          name: 'Bug',
          backgroundColor: '#ea2c00',
          issueCount: 0,
          description: 'Bug',
          order: 3,
        },
        {
          id: 14,
          name: 'Risk',
          backgroundColor: '#393939',
          issueCount: 0,
          description: 'Risk',
          order: 2,
        },
        {
          id: 15,
          name: 'Task',
          backgroundColor: '#a1af2f',
          issueCount: 0,
          description: 'Task',
          order: 1,
        },
      ],
    },
  },
};

export const detailProjectIssueStateSchema: ApiResponseOptions = {
  status: HttpStatus.OK,
  description: 'Response Create Project',
  schema: {
    example: {
      data: {
        id: 32,
        projectId: 6,
        name: 'new',
        status: 2,
        backgroundColor: 'fffffff',
        issueCount: 0,
        description: null,
        order: 6,
        isDefault: false,
        isFirst: true,
        isLast: false,
        createdBy: 2,
        updatedBy: null,
        createdAt: '2023-07-03T06:10:59.476Z',
        updatedAt: '2023-07-03T06:10:59.476Z',
      },
    },
  },
};
