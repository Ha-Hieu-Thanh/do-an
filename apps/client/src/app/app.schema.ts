import { HttpStatus } from '@nestjs/common';
import { ApiResponseOptions } from '@nestjs/swagger';

export const GetListNotificationSchema: ApiResponseOptions = {
  status: HttpStatus.OK,
  description: 'Response login example',
  schema: {
    example: {
      hasMore: true,
      pageIndex: 1,
      totalPages: 2,
      totalItems: 17,
      data: [
        {
          id: 28,
          type: 2,
          title: 'You have an invitation to the project',
          content: 'You have been invited to the project: "xxx". Please confirm the invitation to join the project.',
          targetType: 2,
          targetId: null,
          createdAt: '2023-11-03T01:40:03.913Z',
          notificationMember: {
            isRead: 0,
            status: 1,
          },
          createdBy: {
            id: 5,
            name: 'sasuke',
            avatar: 'https://task-manager-s3.s3.amazonaws.com/1697619139961-ae717d119ecb043aee3d0b1aa3224f6f.jpg',
            avatar50x50:
              'https://task-manager-s3.s3.amazonaws.com/50x50/1697619139961-ae717d119ecb043aee3d0b1aa3224f6f.jpg',
            avatar400x400:
              'https://task-manager-s3.s3.amazonaws.com/400x400/1697619139961-ae717d119ecb043aee3d0b1aa3224f6f.jpg',
            origin: 'https://task-manager-s3.s3.amazonaws.com/1697619139961-ae717d119ecb043aee3d0b1aa3224f6f.jpg',
          },
        },
        {
          id: 27,
          type: 2,
          title: 'You have an invitation to the project',
          content: 'You have been invited to the project: "xxx". Please confirm the invitation to join the project.',
          targetType: 2,
          targetId: null,
          createdAt: '2023-11-02T10:30:42.631Z',
          notificationMember: {
            isRead: 0,
            status: 1,
          },
          createdBy: {
            id: 5,
            name: 'sasuke',
            avatar: 'https://task-manager-s3.s3.amazonaws.com/1697619139961-ae717d119ecb043aee3d0b1aa3224f6f.jpg',
            avatar50x50:
              'https://task-manager-s3.s3.amazonaws.com/50x50/1697619139961-ae717d119ecb043aee3d0b1aa3224f6f.jpg',
            avatar400x400:
              'https://task-manager-s3.s3.amazonaws.com/400x400/1697619139961-ae717d119ecb043aee3d0b1aa3224f6f.jpg',
            origin: 'https://task-manager-s3.s3.amazonaws.com/1697619139961-ae717d119ecb043aee3d0b1aa3224f6f.jpg',
          },
        },
        {
          id: 26,
          type: 2,
          title: 'You have an invitation to the project',
          content: 'You have been invited to the project: "xxx". Please confirm the invitation to join the project.',
          targetType: 2,
          targetId: null,
          createdAt: '2023-11-02T10:21:37.402Z',
          notificationMember: {
            isRead: 0,
            status: 1,
          },
          createdBy: {
            id: 5,
            name: 'sasuke',
            avatar: 'https://task-manager-s3.s3.amazonaws.com/1697619139961-ae717d119ecb043aee3d0b1aa3224f6f.jpg',
            avatar50x50:
              'https://task-manager-s3.s3.amazonaws.com/50x50/1697619139961-ae717d119ecb043aee3d0b1aa3224f6f.jpg',
            avatar400x400:
              'https://task-manager-s3.s3.amazonaws.com/400x400/1697619139961-ae717d119ecb043aee3d0b1aa3224f6f.jpg',
            origin: 'https://task-manager-s3.s3.amazonaws.com/1697619139961-ae717d119ecb043aee3d0b1aa3224f6f.jpg',
          },
        },
        {
          id: 25,
          type: 3,
          title: "sasuke changed the issue's assignee to you.",
          content: 'TM001-170 test noti',
          targetType: 2,
          targetId: null,
          createdAt: '2023-11-02T03:48:38.739Z',
          notificationMember: {
            isRead: 1,
            status: 1,
          },
          createdBy: {
            id: 5,
            name: 'sasuke',
            avatar: 'https://task-manager-s3.s3.amazonaws.com/1697619139961-ae717d119ecb043aee3d0b1aa3224f6f.jpg',
            avatar50x50:
              'https://task-manager-s3.s3.amazonaws.com/50x50/1697619139961-ae717d119ecb043aee3d0b1aa3224f6f.jpg',
            avatar400x400:
              'https://task-manager-s3.s3.amazonaws.com/400x400/1697619139961-ae717d119ecb043aee3d0b1aa3224f6f.jpg',
            origin: 'https://task-manager-s3.s3.amazonaws.com/1697619139961-ae717d119ecb043aee3d0b1aa3224f6f.jpg',
          },
        },
        {
          id: 24,
          type: 3,
          title: "sasuke changed the issue's assignee to you.",
          content: 'TM001-169 test noti',
          targetType: 2,
          targetId: null,
          createdAt: '2023-11-01T08:20:10.440Z',
          notificationMember: {
            isRead: 1,
            status: 1,
          },
          createdBy: {
            id: 5,
            name: 'sasuke',
            avatar: 'https://task-manager-s3.s3.amazonaws.com/1697619139961-ae717d119ecb043aee3d0b1aa3224f6f.jpg',
            avatar50x50:
              'https://task-manager-s3.s3.amazonaws.com/50x50/1697619139961-ae717d119ecb043aee3d0b1aa3224f6f.jpg',
            avatar400x400:
              'https://task-manager-s3.s3.amazonaws.com/400x400/1697619139961-ae717d119ecb043aee3d0b1aa3224f6f.jpg',
            origin: 'https://task-manager-s3.s3.amazonaws.com/1697619139961-ae717d119ecb043aee3d0b1aa3224f6f.jpg',
          },
        },
        {
          id: 23,
          type: 3,
          title: "sasuke changed the issue's assignee to you.",
          content: 'TM001-168 test noti',
          targetType: 2,
          targetId: null,
          createdAt: '2023-11-01T09:20:07.302Z',
          notificationMember: {
            isRead: 1,
            status: 1,
          },
          createdBy: {
            id: 5,
            name: 'sasuke',
            avatar: 'https://task-manager-s3.s3.amazonaws.com/1697619139961-ae717d119ecb043aee3d0b1aa3224f6f.jpg',
            avatar50x50:
              'https://task-manager-s3.s3.amazonaws.com/50x50/1697619139961-ae717d119ecb043aee3d0b1aa3224f6f.jpg',
            avatar400x400:
              'https://task-manager-s3.s3.amazonaws.com/400x400/1697619139961-ae717d119ecb043aee3d0b1aa3224f6f.jpg',
            origin: 'https://task-manager-s3.s3.amazonaws.com/1697619139961-ae717d119ecb043aee3d0b1aa3224f6f.jpg',
          },
        },
        {
          id: 22,
          type: 3,
          title: "sasuke changed the issue's assignee to you.",
          content: 'TM001-167 test noti',
          targetType: 2,
          targetId: null,
          createdAt: '2023-11-01T09:20:03.621Z',
          notificationMember: {
            isRead: 0,
            status: 1,
          },
          createdBy: {
            id: 5,
            name: 'sasuke',
            avatar: 'https://task-manager-s3.s3.amazonaws.com/1697619139961-ae717d119ecb043aee3d0b1aa3224f6f.jpg',
            avatar50x50:
              'https://task-manager-s3.s3.amazonaws.com/50x50/1697619139961-ae717d119ecb043aee3d0b1aa3224f6f.jpg',
            avatar400x400:
              'https://task-manager-s3.s3.amazonaws.com/400x400/1697619139961-ae717d119ecb043aee3d0b1aa3224f6f.jpg',
            origin: 'https://task-manager-s3.s3.amazonaws.com/1697619139961-ae717d119ecb043aee3d0b1aa3224f6f.jpg',
          },
        },
        {
          id: 20,
          type: 3,
          title: "sasuke changed the issue's assignee to you.",
          content: 'TM001-166 Test noti',
          targetType: 2,
          targetId: null,
          createdAt: '2023-11-01T04:03:09.481Z',
          notificationMember: {
            isRead: 0,
            status: 1,
          },
          createdBy: {
            id: 5,
            name: 'sasuke',
            avatar: 'https://task-manager-s3.s3.amazonaws.com/1697619139961-ae717d119ecb043aee3d0b1aa3224f6f.jpg',
            avatar50x50:
              'https://task-manager-s3.s3.amazonaws.com/50x50/1697619139961-ae717d119ecb043aee3d0b1aa3224f6f.jpg',
            avatar400x400:
              'https://task-manager-s3.s3.amazonaws.com/400x400/1697619139961-ae717d119ecb043aee3d0b1aa3224f6f.jpg',
            origin: 'https://task-manager-s3.s3.amazonaws.com/1697619139961-ae717d119ecb043aee3d0b1aa3224f6f.jpg',
          },
        },
        {
          id: 19,
          type: 3,
          title: "{userName} changed the issue's assignee to you.",
          content: '{projectKey}-{issueId} {issueSubject}',
          targetType: 2,
          targetId: null,
          createdAt: '2023-11-01T03:51:21.437Z',
          notificationMember: {
            isRead: 0,
            status: 1,
          },
          createdBy: null,
        },
        {
          id: 18,
          type: 3,
          title: "{userName} changed the issue's assignee to you.",
          content: '{projectKey}-{issueId} {issueSubject}',
          targetType: 2,
          targetId: null,
          createdAt: '2023-11-01T03:50:46.910Z',
          notificationMember: {
            isRead: 0,
            status: 1,
          },
          createdBy: null,
        },
      ],
      countNotiUnread: 14,
    },
  },
};
export const CountNotificationUnreadSchema: ApiResponseOptions = {
  status: HttpStatus.OK,
  description: 'Response login example',
  schema: {
    example: {
      data: 14,
    },
  },
};
