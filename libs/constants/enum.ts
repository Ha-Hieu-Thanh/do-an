/* -------------------------------------------------------------------------- */
/*                             Environment server                             */
/* -------------------------------------------------------------------------- */
export enum Environment {
  Development = 'development',
  Staging = 'staging',
  Production = 'production',
  Test = 'test',
}

/* -------------------------------------------------------------------------- */
/*                                    Error                                   */
/* -------------------------------------------------------------------------- */
export const ErrorCustom = {
  /* ---------------------------------- Common --------------------------------- */
  CAN_NOT_BLOCK_ADMIN: {
    ErrorCode: 'CAN_NOT_BLOCK_ADMIN',
    ErrorMessage: 'You cant block admin',
  },
  User_Not_Permission_Update_Issue: {
    ErrorCode: 'User_Not_Permission_Update_Issue',
    ErrorMessage: 'You cannot update this issue',
  },
  Member_Not_In_Conversation: {
    ErrorCode: 'Member_Not_In_Conversation',
    ErrorMessage: 'You are not in conversation',
  },
  Wiki_Project_Not_Found: {
    ErrorCode: 'Wiki_Project_Not_Found',
    ErrorMessage: 'Wiki project not found',
  },
  Redis_Missing: {
    ErrorCode: 'Redis_Missing',
    ErrorMessage: 'Redis missing',
  },
  Token_Forgot_Password_Expired: {
    ErrorCode: 'Token_Forgot_Password_Expired',
    ErrorMessage: 'Token forgot password expired',
  },
  Token_Forgot_Password_Not_Valid: {
    ErrorCode: 'Token_Forgot_Password_Not_Valid',
    ErrorMessage: 'Token forgot password not valid',
  },
  Request_Duration_Time_Forgot_Password: {
    ErrorCode: 'Request_Duration_Time_Forgot_Password',
    ErrorMessage: 'Request duration time forgot password',
  },
  Invalid_Input_Issue_Post_Id: {
    ErrorCode: 'Invalid_Input_Issue_Post_Id',
    ErrorMessage: 'Invalid input issue post id',
  },
  Invalid_Input_Date_Issue: {
    ErrorCode: 'Invalid_Input_Date_Issue',
    ErrorMessage: 'Invalid input date issue',
  },
  Forbidden_Resource: {
    ErrorCode: 'Forbidden_Resource',
    ErrorMessage: 'Forbidden resource',
  },
  Project_Version_Invalid_Input: {
    ErrorCode: 'Project_Version_Invalid_Input',
    ErrorMessage: 'Project version invalid input',
  },
  Issue_Category_Invalid_Input: {
    ErrorCode: 'Issue_Category_Invalid_Input',
    ErrorMessage: 'Issue category invalid input',
  },
  Issue_Type_Invalid_Input: {
    ErrorCode: 'Issue_Type_Invalid_Input',
    ErrorMessage: 'Issue type invalid input',
  },
  Unauthorized: {
    ErrorCode: 'Unauthorized',
    ErrorMessage: 'Unauthorized',
  },
  Invalid_Input: {
    ErrorCode: 'Invalid_Input',
    ErrorMessage: 'Invalid input',
  },
  Not_Found: {
    ErrorCode: 'Not_Found',
    ErrorMessage: 'Not found',
  },
  Unknown_Error: {
    ErrorCode: 'Unknown_Error',
    ErrorMessage: 'Unknown error',
  },
  The_Allowed_Number_Of_Calls_Has_Been_Exceeded: {
    ErrorCode: 'The_Allowed_Number_Of_Calls_Has_Been_Exceeded',
    ErrorMessage: 'The allowed number of calls has been exceeded',
  },
  Email_Not_Found: {
    ErrorCode: 'Email_Not_Found',
    ErrorMessage: 'Email not found',
  },
  User_Blocked: {
    ErrorCode: 'User_Blocked',
    ErrorMessage: 'User blocked',
  },
  Email_Or_Password_Not_valid: {
    ErrorCode: 'Email_Or_Password_Not_valid',
    ErrorMessage: 'Email or password not valid',
  },
  Email_User_Already_Account_Pending: {
    ErrorCode: 'Email_User_Already_Account_Pending',
    ErrorMessage: 'Your account is already pending',
  },
  Email_User_Already_Account: {
    ErrorCode: 'Email_User_Already_Account',
    ErrorMessage: 'Your account is already',
  },
  Invite_Code_Invalid_Input: {
    ErrorCode: 'Invite_Code_Invalid_Input',
    ErrorMessage: 'Invite code invalid input',
  },
  Key_Config_Duplicate: {
    ErrorCode: 'Key_Config_Duplicate',
    ErrorMessage: 'Key Config Duplicate',
  },
  Key_Config_Not_Found: {
    ErrorCode: 'Key_Config_Not_Found',
    ErrorMessage: 'Key_Config_Not_Found',
  },
  Key_Project_Duplicate: {
    ErrorCode: 'Key_Project_Duplicate',
    ErrorMessage: 'Key Project Duplicate',
  },
  User_Not_In_Project: {
    ErrorCode: 'User_Not_In_Project',
    ErrorMessage: 'User not in project',
  },
  User_Not_Action_Project: {
    ErrorCode: 'User_Not_Action_Project',
    ErrorMessage: 'User not action project',
  },
  Project_Not_Found: {
    ErrorCode: 'Project_Not_Found',
    ErrorMessage: 'Project not found',
  },
  Email_User_Not_In_System: {
    ErrorCode: 'Email_User_Not_In_System',
    ErrorMessage: 'Email user not in system',
  },
  User_Is_Already_In_The_Project: {
    ErrorCode: 'User_Is_Already_In_The_Project',
    ErrorMessage: 'User is already in the project',
  },
  Email_User_Not_Active: {
    ErrorCode: 'Email_User_Not_Active',
    ErrorMessage: 'Email user not active',
  },
  User_Not_Pending_Request_Join_Project: {
    ErrorCode: 'User_Not_Pending_Request_Join_Project',
    ErrorMessage: 'User not pending request join project',
  },
  User_Project_Not_Active: {
    ErrorCode: 'User_Project_Not_Active',
    ErrorMessage: 'User project not active',
  },
  Can_Not_Update_Pm_Project: {
    ErrorCode: 'Can_Not_Update_Pm_Project',
    ErrorMessage: 'Can not update pm project',
  },
  Project_Issue_Handle_Id_Not_Found: {
    ErrorCode: 'Project_Issue_Handle_Id_Not_Found',
    ErrorMessage: 'Project issue handle id not found',
  },
  Invalid_Pre_Or_Post_Update: {
    ErrorCode: 'Invalid_Pre_Or_Post_Update',
    ErrorMessage: 'Invalid pre or post update',
  },
  User_Assignee_Not_In_Project: {
    ErrorCode: 'User_Assignee_Not_In_Project',
    ErrorMessage: 'User assignee not in project',
  },
  User_Assignee_In_Project_Not_Active: {
    ErrorCode: 'User_Assignee_In_Project_Not_Active',
    ErrorMessage: 'User assignee in project not active',
  },
  Issue_Not_Invalid: {
    ErrorCode: 'Issue_Not_Invalid',
    ErrorMessage: 'Issue not invalid',
  },
  Comment_Content_Or_Files_Required: {
    ErrorCode: 'Comment_Content_Or_Files_Required',
    ErrorMessage: 'Comment content or files required',
  },
  Comment_Create_Failed: {
    ErrorCode: 'Comment_Create_Failed',
    ErrorMessage: 'Comment create failed',
  },
};
export type ErrorValues = (typeof ErrorCustom)[keyof typeof ErrorCustom];

/* -------------------------------------------------------------------------- */
/*                                    Auth                                    */
/* -------------------------------------------------------------------------- */
export const ValuesImportant = ['password', 'refreshToken', 'oldPassword', 'newPassword'];
export enum TokenType {
  ACCESS_TOKEN = 'ACCESS_TOKEN',
  REFRESH_TOKEN = 'REFRESH_TOKEN',
}

export enum UserStatus {
  ACTIVE = 1,
  BLOCKED = 2,
  PENDING = 3,
}

// export enum ClientLoginType {
//   DEFAULT = 1,
//   LINE = 2,
//   GOOGLE = 3,
//   FACEBOOK = 4,
//   TWITTER = 5,
//   YAHOO = 6,
// }

export enum UserRole {
  ADMIN = 1,
  USER = 2,
}

/* -------------------------------------------------------------------------- */
/*                                    Cache                                   */
/* -------------------------------------------------------------------------- */
export enum TypeCacheData {
  USER_INFORMATION = 'USER_INFORMATION',
  PROJECT_INFORMATION = 'PROJECT_INFORMATION',
}

/* -------------------------------------------------------------------------- */
/*                                   Common                                   */
/* -------------------------------------------------------------------------- */
export enum CommonStatus {
  IN_ACTIVE = 0,
  ACTIVE = 1,
}

export enum Gender {
  MALE = 1,
  FEMALE = 2,
  ALL = 3,
}

/* -------------------------------------------------------------------------- */
/*                                    Queue                                   */
/* -------------------------------------------------------------------------- */
export enum QueueProcessor {
  PROCESS_SEND_MAIL = `PROCESS_SEND_MAIL`,
  PUSH_NOTIFICATION = `PUSH_NOTIFICATION`,
  SYNC_TASK_ELK = `SYNC_TASK_ELK`,
}

/* -------------------------------------------------------------------------- */
/*                                    Noti                                    */
/* -------------------------------------------------------------------------- */

export enum NotificationType {
  WelCome_First_Login = 1,
  Invitation_To_The_Project = 2,
  Assignee_To_The_Issue = 3,
  Confirm_Invite_To_The_Project = 4,
  Reject_Invite_To_The_Project = 5,
  YOU_ARE_MENTIONED,
  Task_Deadline,
}
export enum NotificationTitle {
  WelCome_First_Login = 'Welcome to the {appName}',
  Invitation_To_The_Project = 'You have an invitation to the project',
  Assignee_To_The_Issue = `{userName} changed the issue's assignee to you.`,
  Confirm_Invite_To_The_Project = `{userName} joined the project`,
  Reject_Invite_To_The_Project = `{userName} reject the project`,
  YOU_ARE_MENTIONED = `{username} mentioned you in the comment.`,
  Task_Deadline = 'You have a task deadline in 10 minutes created by {userName}',
  Task_Deadline_On_Time = "{userName} has a task that's late",
}
export enum NotificationContent {
  WelCome_First_Login = `Thank you for choosing our system. If you encounter any issues, please contact us so that we can provide you with the fastest assistance possible.`,
  Invitation_To_The_Project = `You have been invited to the project: "{projectName}". Please confirm the invitation to join the project.`,
  Assignee_To_The_Issue = `{projectKey}-{issueId} {issueSubject}`,
  Confirm_Invite_To_The_Project = `{projectName} ({projectKey})`,
  Reject_Invite_To_The_Project = `{projectName} ({projectKey})`,
  YOU_ARE_MENTIONED = `{projectKey}-{issueId} {issueSubject}: {content}`,
  Task_Deadline = '{projectKey}-{issueId} {issueSubject}',
  Task_Deadline_On_Time = '{projectKey}-{issueId} {issueSubject}',
}
/* -------------------------------------------------------------------------- */
/*                                    Mail                                    */
/* -------------------------------------------------------------------------- */
export enum MailType {
  Client_Register_Account = 1,
  Client_Forgot_Password = 2,
}
export enum MailContent {
  Client_Register_Account = 'Client Register Account',
  Client_Forgot_Password = 'Forgot password Account',
}
export enum MailSubject {
  Client_Register_Account = 'Client Register Account',
  Client_Forgot_Password = 'Forgot password Account',
}
export enum MailHtml {
  Client_Register_Account = `
    <p>You have 1 request to register an account at {appName}.</p><br/> 
    <p>Verify your registered email with the link below:</p><br/>
    <<a href="{link}">link verify</a>><br/><br/>
  `,
  Client_Forgot_Password = `
    <p>You have 1 request to forgot password an account at {appName}.</p><br/> 
    <p>Change password with the link below:</p><br/>
    <<a href="{link}">link verify</a>><br/><br/>
  `,
}

export enum UserCompanyStatus {
  IN_ACTIVE = 1,
  ACTIVE = 2,
  PENDING = 3,
  REJECT = 4,
}

/* -------------------------------------------------------------------------- */
/*                                   Project                                  */
/* -------------------------------------------------------------------------- */

export enum UserProjectRole {
  PM = 1,
  SUB_PM = 2,
  STAFF = 3,
}
export enum UserProjectStatus {
  IN_ACTIVE = 1,
  ACTIVE = 2,
  PENDING = 3,
  REJECT = 4,
}
export enum ProjectIssueTypeStatus {
  IN_ACTIVE = 1,
  ACTIVE = 2,
}
export enum ProjectIssueCategoryStatus {
  IN_ACTIVE = 1,
  ACTIVE = 2,
}
export enum ProjectVersionStatus {
  IN_ACTIVE = 1,
  ACTIVE = 2,
}
export enum ProjectIssueStateStatus {
  IN_ACTIVE = 1,
  ACTIVE = 2,
}
export const ProjectIssueTypesDefault = [
  {
    name: 'Request',
    backgroundColor: '#ea733b',
    description: 'Request',
    isDefault: true,
    order: 5,
    isFirst: true,
  },
  {
    name: 'Other',
    backgroundColor: '#3b9dbd',
    description: 'Other',
    isDefault: true,
    order: 4,
  },
  {
    name: 'Bug',
    backgroundColor: '#ea2c00',
    description: 'Bug',
    isDefault: true,
    order: 3,
  },
  {
    name: 'Risk',
    backgroundColor: '#393939',
    description: 'Risk',
    isDefault: true,
    order: 2,
  },
  {
    name: 'Task',
    backgroundColor: '#a1af2f',
    description: 'Task',
    isDefault: true,
    order: 1,
    isLast: true,
  },
];
export const ProjectIssueStatesDefault = [
  {
    name: 'Open',
    backgroundColor: '#ea733b',
    description: 'Open',
    isDefault: true,
    order: 6,
    isFirst: true,
  },
  {
    name: 'In Progress',
    backgroundColor: '#4488c5',
    description: 'In Progress',
    isDefault: true,
    order: 5,
  },
  {
    name: 'Resolved',
    backgroundColor: '#5eb5a6',
    description: 'Resolved',
    isDefault: true,
    order: 4,
  },
  {
    name: 'Pending',
    backgroundColor: '#f42858',
    description: 'Pending',
    isDefault: true,
    order: 3,
  },
  {
    name: 'Cancel',
    backgroundColor: '#393939',
    description: 'Cancel',
    isDefault: true,
    order: 2,
  },
  {
    name: 'Closed',
    backgroundColor: '#a1af2f',
    description: 'Closed',
    isDefault: true,
    order: 1,
    isLast: true,
  },
];

/* -------------------------------------------------------------------------- */
/*                                    Issue                                   */
/* -------------------------------------------------------------------------- */
export enum IssueStatus {
  ACTIVE = 1,
  DELETE = 2,
}
export enum Priority {
  LOW = 1,
  NORMAL = 2,
  HIGH = 3,
}
export enum IssueHistoryType {
  CREATE = 1,
  UPDATE = 2,
}
export const TextPriority = {
  [Priority.LOW]: 'Low',
  [Priority.NORMAL]: 'Normal',
  [Priority.HIGH]: 'High',
};

/* -------------------------------------------------------------------------- */
/*                                    wiki                                    */
/* -------------------------------------------------------------------------- */
export enum WikiStatus {
  ACTIVE = 1,
  DELETE = 2,
}

export enum SocketEventKeys {
  PING = 'PING',
  PONG = 'PONG',
  INVALID_INPUT = 'INVALID_INPUT',

  GET_OR_CREATE_CONVERSATION_P2P = 'GET_OR_CREATE_CONVERSATION_P2P',
  FETCH_LIST_CONVERSATION = 'FETCH_LIST_CONVERSATION',
  SEND_MESSAGE = 'SEND_MESSAGE',
  JOIN_CONVERSATION = 'JOIN_CONVERSATION',
  LEAVE_CONVERSATION = 'LEAVE_CONVERSATION',
  NEW_MESSAGE = 'NEW_MESSAGE',
  CONVERSATION = 'CONVERSATION',
  FETCH_MESSAGE = 'FETCH_MESSAGE',
  UPDATE_LAST_TIME_VIEW = 'UPDATE_LAST_TIME_VIEW',
  JOIN_ISSUE_COMMENT = 'JOIN_ISSUE_COMMENT',
  LEAVE_ISSUE_COMMENT = 'LEAVE_ISSUE_COMMENT',
  NEW_COMMENT = 'NEW_COMMENT',
}
// export enum ActionConversationType {
//   NEW_MESSAGE = 'NEW_MESSAGE',
//   UPDATE_LAST_TIME_VIEW = 'UPDATE_LAST_TIME_VIEW',
// }
export const EmitterConstant = {
  EMIT_TO_CLIENT: 'EMIT_TO_CLIENT',
  EMIT_TO_CLIENT_CREATE_COMMENT: 'EMIT_TO_CLIENT_CREATE_COMMENT',
};
export const ConversationEvent = {
  NEW_MESSAGE: 'NEW_MESSAGE', // Noti test
  NEW_NOTI: 'NEW_NOTI', // Noti test
};

export enum ContactState {
  UNREAD = 1,
  READ = 2,
  REPLY = 3,
}

export enum NotificationRedirectType {
  PROJECT_BOARD = 1,
  HOME = 2,
  PROJECT_SETTING_MEMBER = 3,
  PROJECT_ISSUE = 4,
}

export enum NotificationTargetType {
  CLIENT = 1,
  PROJECT = 2,
}
export enum ReadNotification {
  UNREAD = 0,
  READ = 1,
}
