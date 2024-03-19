import { IsNotEmpty, IsString } from 'class-validator';

export class JoinLeaveIssueCommentDto {
  @IsNotEmpty()
  @IsString()
  issueId: string;
}
