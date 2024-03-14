import { ApiResponseOptions } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';

export const createProjectSchema: ApiResponseOptions = {
  status: HttpStatus.OK,
  description: 'Response Create Project',
  schema: {
    example: {
      data: 3,
    },
  },
};
export const getMyProjectsSchema: ApiResponseOptions = {
  status: HttpStatus.OK,
  description: 'Response Create Project',
  schema: {
    example: {
      hasMore: false,
      pageIndex: 1,
      totalPages: 1,
      totalItems: 4,
      data: [
        {
          id: 7,
          name: 'my project 1',
          key: 'MP1',
          state: 2,
          status: 1,
          userProject: {
            userId: 2,
            projectId: 7,
            role: 1,
            status: 2,
            createdAt: '2023-06-27T04:49:37.974Z',
          },
        },
        {
          id: 8,
          name: 'my project 2',
          key: 'MP2',
          state: 2,
          status: 1,
          userProject: {
            userId: 2,
            projectId: 8,
            role: 1,
            status: 2,
            createdAt: '2023-06-27T06:03:54.597Z',
          },
        },
        {
          id: 9,
          name: 'my project 99',
          key: 'MP9',
          state: 3,
          status: 1,
          userProject: {
            userId: 2,
            projectId: 9,
            role: 1,
            status: 2,
            createdAt: '2023-06-27T06:04:09.265Z',
          },
        },
        {
          id: 10,
          name: 'My Project 5',
          key: 'MP5',
          state: 2,
          status: 1,
          userProject: {
            userId: 2,
            projectId: 10,
            role: 1,
            status: 2,
            createdAt: '2023-06-27T16:31:35.342Z',
          },
        },
      ],
    },
  },
};
export const getDetailProjectSchema: ApiResponseOptions = {
  status: HttpStatus.OK,
  description: 'Response Create Project',
  schema: {
    example: {
      data: {
        id: 6,
        memberCount: 1,
        name: 'my project 1',
        key: 'MP1',
        state: 2,
        status: 1,
        type: 1,
        avatar: null,
        projectIssueTypes: [
          {
            id: 13,
            name: 'Open',
            backgroundColor: '#ea733b',
            issueCount: 0,
            description: 'Open',
            order: 6,
          },
          {
            id: 16,
            name: 'Pending',
            backgroundColor: '#f42858',
            issueCount: 0,
            description: 'Pending',
            order: 5,
          },
          {
            id: 15,
            name: 'Resolved',
            backgroundColor: '#5eb5a6',
            issueCount: 0,
            description: 'Resolved',
            order: 4,
          },
          {
            id: 17,
            name: 'Cancel',
            backgroundColor: '#393939',
            issueCount: 0,
            description: 'Cancel',
            order: 3,
          },
          {
            id: 14,
            name: 'In Progress',
            backgroundColor: '#4488c5',
            issueCount: 0,
            description: 'In Progress',
            order: 2,
          },
          {
            id: 18,
            name: 'Closed',
            backgroundColor: '#a1af2f',
            issueCount: 0,
            description: 'Closed',
            order: 1,
          },
        ],
        projectIssueStates: [
          {
            id: 15,
            name: 'Task',
            backgroundColor: '#a1af2f',
            issueCount: 0,
            description: 'Task',
            order: 6,
          },
          {
            id: 11,
            name: 'Request',
            backgroundColor: '#ea733b',
            issueCount: 0,
            description: 'Request',
            order: 4,
          },
          {
            id: 12,
            name: 'Other',
            backgroundColor: '#3b9dbd',
            issueCount: 0,
            description: 'Other',
            order: 3,
          },
          {
            id: 13,
            name: 'Bug',
            backgroundColor: '#ea2c00',
            issueCount: 0,
            description: 'Bug',
            order: 2,
          },
          {
            id: 14,
            name: 'Risk',
            backgroundColor: '#393939',
            issueCount: 0,
            description: 'Risk',
            order: 1,
          },
        ],
        projectIssueCategories: [],
        projectVersions: [],
      },
    },
  },
};
