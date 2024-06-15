import ProjectIssueCategory from '@app/database-type-orm/entities/task-manager/ProjectIssueCategory';
import ProjectIssueState from '@app/database-type-orm/entities/task-manager/ProjectIssueState';
import ProjectIssueType from '@app/database-type-orm/entities/task-manager/ProjectIssueType';
import ProjectVersion from '@app/database-type-orm/entities/task-manager/ProjectVersion';
import User from '@app/database-type-orm/entities/task-manager/User';
import { UserProjectRole, UserProjectStatus, UserRole, UserStatus } from 'libs/constants/enum';

export interface IToken {
  token: string;
  refreshToken: string;
  isFirstLogin?: boolean;
}
export interface IPayloadToken {
  id: number;
  role: number;
  timeStamp: number;
}

export interface IGetUserInfoCache {
  id: number;
  name: string;
  avatar?: string;
  email: string;
  status: UserStatus;
  role: UserRole;
  listProjectIds: number[];
}

export interface IUserProjectByUserId {
  userId: number;
  status: UserProjectStatus;
  role: UserProjectRole;
  user: User;
}
export interface IGetProjectInfoCache {
  id: number;
  name: string;
  key: string;
  userProjectByUserId: {
    [key: string]: IUserProjectByUserId;
  };
  projectIssueCategory: number[];
  projectIssueState: number[];
  projectIssueType: number[];
  projectVersion: number[];
  projectIssueCategoryById: {
    [key: string]: ProjectIssueCategory;
  };
  projectIssueStateById: {
    [key: string]: ProjectIssueState;
  };
  projectIssueTypeById: {
    [key: string]: ProjectIssueType;
  };
  projectVersionById: {
    [key: string]: ProjectVersion;
  };
}
