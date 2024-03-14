import { AbilityProject, Action, Subject } from '@app/authorization';
import { SetMetadata } from '@nestjs/common';

interface IPolicyHandler {
  handle(ability: AbilityProject): boolean;
}

type PolicyHandlerCallback = (ability: AbilityProject) => boolean;

export type PolicyHandler = IPolicyHandler | PolicyHandlerCallback;

export class PolicyHandlerCustom implements IPolicyHandler {
  private action: Action;
  private subject: Subject;
  constructor(action: Action, subject: Subject) {
    this.action = action;
    this.subject = subject;
  }
  handle(ability: AbilityProject) {
    return ability.can(this.action, this.subject);
  }
}

export const CHECK_POLICIES_KEY = 'checkPolicy';
export const CheckPolicies = (...handlers: PolicyHandler[]) => SetMetadata(CHECK_POLICIES_KEY, handlers);
