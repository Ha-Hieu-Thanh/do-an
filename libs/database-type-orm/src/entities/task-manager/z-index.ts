import Issue from './Issue';
import IssueHistory from './IssueHistory';
import Notification from './Notification';
import NotificationMember from './NotificationMember';
import Project from './Project';
import ProjectIssueCategory from './ProjectIssueCategory';
import ProjectIssueState from './ProjectIssueState';
import ProjectIssueType from './ProjectIssueType';
import ProjectVersion from './ProjectVersion';
import User from './User';
import UserProject from './UserProject';
import { Wiki } from './Wiki';

export const TaskManagerDefaultEntities = [
  User,
  Project,
  UserProject,
  ProjectIssueType,
  ProjectIssueCategory,
  ProjectVersion,
  ProjectIssueState,
  Issue,
  IssueHistory,
  Wiki,
  Notification,
  NotificationMember,
];
export default TaskManagerDefaultEntities;
