import { IUserProjectByUserId } from '@app/core/types';
import { AbilityBuilder, MongoAbility, createMongoAbility } from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { UserProjectRole } from 'libs/constants/enum';

export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

export enum Subject {
  All = 'all',
  Project = 'project',
  ProjectMember = 'projectMember',
  ProjectIssueType = 'projectIssueType',
  ProjectIssueCategory = 'projectIssueCategory',
  ProjectIssueState = 'projectIssueState',
  ProjectVersion = 'projectVersion',
  ProjectIssue = 'projectIssue',
  ProjectWiki = 'projectWiki',
}

type SubjectsProject =
  | Subject.All
  | Subject.Project
  | Subject.ProjectMember
  | Subject.ProjectIssueType
  | Subject.ProjectIssueCategory
  | Subject.ProjectIssueState
  | Subject.ProjectVersion
  | Subject.ProjectIssue
  | Subject.ProjectWiki;

export type AbilityProject = MongoAbility<[Action, SubjectsProject]>;
@Injectable()
export class AuthorizationService {
  createAbilityForProject(userProject: IUserProjectByUserId) {
    const { can, cannot, build } = new AbilityBuilder<AbilityProject>(createMongoAbility);

    if ([UserProjectRole.PM, UserProjectRole.SUB_PM].includes(userProject.role)) {
      can(Action.Manage, Subject.All);
    }

    if (UserProjectRole.STAFF === userProject.role) {
      can(Action.Read, Subject.Project);
      can(Action.Read, Subject.ProjectMember);
      can(Action.Read, Subject.ProjectIssueType);
      can(Action.Read, Subject.ProjectIssueCategory);
      can(Action.Read, Subject.ProjectIssueState);
      can(Action.Read, Subject.ProjectVersion);
      can(Action.Read, Subject.ProjectWiki);
      can(Action.Manage, Subject.ProjectIssue);
    }

    return build({
      detectSubjectType: (item) => item,
    });
  }
}
