import { HttpStatus } from '@nestjs/common';
import { ApiResponseOptions } from '@nestjs/swagger';

export const listIssueSchema: ApiResponseOptions = {
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
          id: 7,
          subject: 'subject',
          order: 2,
          priority: 1,
          startDate: '2024-05-11',
          dueDate: '2025-09-11',
          estimatedHours: '1.50',
          actualHours: '1.00',
          projectIssueType: {
            id: 100,
            name: 'new',
            backgroundColor: 'fffffff',
          },
          projectIssueCategory: null,
          projectVersion: null,
          assignee: {
            id: 5,
            name: 'sasuke',
            avatar: 'https://aml-maru.s3.amazonaws.com/1688550208823-21e2e9daf0579180cacf07457f3eb63a.jpg',
            avatar50x50: 'https://aml-maru.s3.amazonaws.com/50x50/1688550208823-21e2e9daf0579180cacf07457f3eb63a.jpg',
            avatar400x400:
              'https://aml-maru.s3.amazonaws.com/400x400/1688550208823-21e2e9daf0579180cacf07457f3eb63a.jpg',
            origin: 'https://aml-maru.s3.amazonaws.com/1688550208823-21e2e9daf0579180cacf07457f3eb63a.jpg',
          },
        },
        {
          id: 6,
          subject: 'subject',
          order: 1,
          priority: 1,
          startDate: '2024-05-11',
          dueDate: '2025-09-11',
          estimatedHours: '1.50',
          actualHours: '1.00',
          projectIssueType: {
            id: 100,
            name: 'new',
            backgroundColor: 'fffffff',
          },
          projectIssueCategory: null,
          projectVersion: null,
          assignee: {
            id: 5,
            name: 'sasuke',
            avatar: 'https://aml-maru.s3.amazonaws.com/1688550208823-21e2e9daf0579180cacf07457f3eb63a.jpg',
            avatar50x50: 'https://aml-maru.s3.amazonaws.com/50x50/1688550208823-21e2e9daf0579180cacf07457f3eb63a.jpg',
            avatar400x400:
              'https://aml-maru.s3.amazonaws.com/400x400/1688550208823-21e2e9daf0579180cacf07457f3eb63a.jpg',
            origin: 'https://aml-maru.s3.amazonaws.com/1688550208823-21e2e9daf0579180cacf07457f3eb63a.jpg',
          },
        },
      ],
    },
  },
};

export const getDetailProjectIssueSchema: ApiResponseOptions = {
  status: HttpStatus.OK,
  description: 'Response Create Project',
  schema: {
    example: {
      data: {
        id: 17,
        subject: 'mothaihanadf',
        order: 1,
        description: '<p>adf;lj;ladjf;lkdj;lkjad;fjadfdaf;ljad;lsfkj;ladfs</p>',
        status: 1,
        priority: 2,
        startDate: '2023-08-03',
        dueDate: '2023-08-24',
        estimatedHours: '1.00',
        actualHours: '1.00',
        type: {
          id: 116,
          name: 'new',
          backgroundColor: 'fffffff',
        },
        state: {
          id: 105,
          name: 'Open',
          backgroundColor: '#ea733b',
        },
        assignee: {
          id: 2,
          name: 'mazaha',
          avatar: 'https://aml-maru.s3.amazonaws.com/1688550208823-21e2e9daf0579180cacf07457f3eb63a.jpg',
        },
        category: {
          id: 12,
          name: 'New category 5',
        },
        version: {
          id: 7,
          name: '1.4',
        },
      },
    },
  },
};
