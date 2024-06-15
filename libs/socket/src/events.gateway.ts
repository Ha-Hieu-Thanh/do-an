import { UtilsService } from '@app/helpers/utils/utils.service';
import { JwtAuthenticationService } from '@app/jwt-authentication';
import { Logger, UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OnEvent } from '@nestjs/event-emitter/dist/decorators';
import { OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { EmitterConstant, Environment, ErrorCustom, SocketEventKeys } from 'libs/constants/enum';
import { Namespace, Socket, Server } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { WsExceptionsFilter } from './ws-exception.filter';
import { SocketService } from './socket.service';
import { JoinLeaveIssueCommentDto } from './dto/join-leave-conversation.dto';
import { CommentDocument } from '@app/database-mongodb/schemas/comment.schema';
export type TSocketData = {
  /**user id */
  id: string;
};

@UsePipes(ValidationPipe)
@UseFilters(WsExceptionsFilter)
@WebSocketGateway({ transports: ['websocket'], namespace: 'socket' })
export class EventsGateway {
  @WebSocketServer()
  server: Namespace<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, TSocketData>;
  private readonly logger = new Logger(EventsGateway.name);
  private readonly nodeEnv: Environment;
  constructor(
    private readonly jwtAuthenticationService: JwtAuthenticationService,
    private readonly utilsService: UtilsService,
    private readonly configService: ConfigService,
    private readonly socketService: SocketService,
  ) {
    this.nodeEnv = this.configService.get<Environment>('nodeEnv', Environment.Development);
  }

  afterInit() {
    this.server.use(async (client, next) => {
      try {
        const authorization = client.handshake.headers.authorization || client.handshake.auth.token;
        if (authorization) {
          const payload = await this.jwtAuthenticationService.verifyAccessToken(String(authorization));
          if (!payload) {
            return next(Object.assign(new Error(ErrorCustom.Unauthorized.ErrorMessage)));
          }
          Object.assign(client.data, { id: payload.id });
        }

        if (!authorization) {
          return next(Object.assign(new Error(ErrorCustom.Unauthorized.ErrorMessage)));
        }

        return next();
      } catch (error) {
        this.logger.error(error);
        return next(new Error(error.message));
      }
    });
  }

  generateMultipleMemberRoom(userIds: number[] | string[]) {
    return userIds?.map((userId) => this.generateMemberRoom(userId));
  }

  generateMemberRoom(id: number | string) {
    return `member_${id}`;
  }

  generateConversationRoom(id: number | string) {
    return `conversation_${id}`;
  }

  handleConnection(client: Socket, ...args: any[]) {
    client.removeAllListeners();
    const userId = client.data.id;

    if (userId) {
      client.join(this.generateMemberRoom(userId));
      this.logger.debug(`---user connected, userId: ${userId}, clientId:${client.id}`);
    }

    if (!userId) {
      this.logger.debug(`---user future connected, clientId:${client.id}`);
    }
  }

  handleDisconnect(client: Socket) {
    const userId = client.data.id;
    if (userId) {
      this.logger.debug(`---user disconnected, userId: ${userId}, clientId : ${client.id}`);
    }
    if (!userId) {
      this.logger.debug(`---user future disconnected, clientId : ${client.id}`);
    }
  }

  getListSocketIdInRoom(roomName: string) {
    const results = this.server.adapter.rooms.get(roomName);
    return results ? Array.from(results) : [];
  }

  getMemberOnline(userId: number) {
    const room = this.generateMemberRoom(userId);
    const data = this.getListSocketIdInRoom(room);
    return !!data.length;
  }

  @OnEvent(EmitterConstant.EMIT_TO_CLIENT)
  async handleEmitToClient(userIds: string[], event: string, payload: object) {
    return this.server.to(this.generateMultipleMemberRoom(userIds)).emit(event, payload);
  }

  @SubscribeMessage(SocketEventKeys.PING)
  async handlePing(client: Socket) {
    try {
      return this.utilsService.socketSuccess(SocketEventKeys.PONG, client.data.id);
    } catch (error) {
      return this.utilsService.socketFail(SocketEventKeys.PONG, error);
    }
  }

  //   /* -------------------------------------------------------------------------- */
  //   /*                              COMMENT                                       */
  //   /* -------------------------------------------------------------------------- */
  generateIssueCommentRoom(issueId: number | string) {
    return `ISSUE_COMMENT_${issueId}`;
  }

  // function to handle after frontend watching the issue then call the socket -> then join the room name 'ISSUE_COMMENT_`${issueId}'
  @SubscribeMessage(SocketEventKeys.JOIN_ISSUE_COMMENT)
  async joinIssueComment(client: Socket, issueId: number) {
    try {
      // const parsedBody = JSON.parse(body) as JoinLeaveIssueCommentDto;

      // const issueId = parsedBody.issx`ueId;
      client.join(this.generateIssueCommentRoom(issueId));
      return this.utilsService.socketSuccess(SocketEventKeys.JOIN_ISSUE_COMMENT, client.data.id);
    } catch (error) {
      this.logger.log(error);
      return this.utilsService.socketFail(SocketEventKeys.JOIN_ISSUE_COMMENT, error);
    }
  }

  // function to handle after frontend unwatching the issue then call the socket -> then leave the room name 'ISSUE_COMMENT_`${issueId}'
  @SubscribeMessage(SocketEventKeys.LEAVE_ISSUE_COMMENT)
  async leaveIssueComment(client: Socket, body: any) {
    try {
      const parsedBody = JSON.parse(body) as JoinLeaveIssueCommentDto;
      const issueId = parsedBody.issueId;
      client.leave(this.generateIssueCommentRoom(issueId));
      return this.utilsService.socketSuccess(SocketEventKeys.LEAVE_ISSUE_COMMENT, client.data.id);
    } catch (error) {
      return this.utilsService.socketFail(SocketEventKeys.LEAVE_ISSUE_COMMENT, error);
    }
  }

  // onEvent to handle emit to client after create comment
  @OnEvent(EmitterConstant.EMIT_TO_CLIENT_CREATE_COMMENT)
  async handleEmitToClientCreateComment(issueId: string, payload: CommentDocument) {
    return this.server.to(this.generateIssueCommentRoom(issueId)).emit(SocketEventKeys.NEW_COMMENT, payload);
  }
  //   /* -------------------------------------------------------------------------- */
  //   /*                                Conversation                                */
  //   /* -------------------------------------------------------------------------- */
  //   /**
  //    * User A want to send message to user B
  //    * What is A conversationID of A & B?
  //    *   - If they do not have conversation before => create new conversation and get conversationID
  //    *   - If they already have conversation before => return conversationID
  //    * conversationID is required when:
  //    *   - LEAVE_CONVERSATION
  //    *   - FETCH_MESSAGE
  //    *   - SEND_MESSAGE
  //    * TODO:
  //    * 1. Check is conversation exist
  //    * 2. Create conversation if it isn't exist
  //    * 3. Return conversationID
  //    */
  //   @SubscribeMessage(SocketEventKeys.GET_OR_CREATE_CONVERSATION_P2P)
  //   async getPrCreateP2PConversation(client: Socket, body: GetOrCreateP2PConversationDto) {
  //     const result = await this.socketService.getOrCreateP2PConversation(client.data.id, body.targetId);
  //     return this.utilsService.socketSuccess(SocketEventKeys.GET_OR_CREATE_CONVERSATION_P2P, client.data.id, result);
  //   }

  //   /**
  //    * List user's conversations
  //    *   - It may is P2P(user A and user B can only have 1 P2P conversation)
  //    *   - It may is group(one or more people can send message)
  //    */
  //   @UsePipes(AssignLoadMore)
  //   @SubscribeMessage(SocketEventKeys.FETCH_LIST_CONVERSATION)
  //   async fetchListConversation(client: Socket, body: FetchListConversationDto) {
  //     this.utilsService.assignPaging(body);
  //     const result = await this.socketService.fetchListConversation(client.data.id, body);
  //     const data = result.map((item) => {
  //       if (item.conversationType === ConversationType.P2P) {
  //         const isOnline = this.getMemberOnline(item.target.id);

  //         Object.assign(item.target, { isOnline });
  //       }
  //       return item;
  //     });
  //     return this.utilsService.socketSuccess(SocketEventKeys.FETCH_LIST_CONVERSATION, client.data.id, data);
  //   }

  //   @SubscribeMessage(SocketEventKeys.JOIN_CONVERSATION)
  //   async joinConversation(client: Socket, { conversationId }: JoinLeaveConversationDto) {
  //     await this.socketService.checkMemberInConversation(client.data.id, conversationId);

  //     client.join(this.generateConversationRoom(conversationId));
  //     return this.utilsService.socketSuccess(SocketEventKeys.JOIN_CONVERSATION, client.data.id);
  //   }

  //   @SubscribeMessage(SocketEventKeys.LEAVE_CONVERSATION)
  //   async leaveConversation(client: Socket, { conversationId }: JoinLeaveConversationDto) {
  //     await this.socketService.checkMemberInConversation(client.data.id, conversationId);

  //     client.leave(this.generateConversationRoom(conversationId));
  //     return this.utilsService.socketSuccess(SocketEventKeys.LEAVE_CONVERSATION, client.data.id);
  //   }

  //   /* -------------------------------------------------------------------------- */
  //   /*                                   Message                                  */
  //   /* -------------------------------------------------------------------------- */
  //   @SubscribeMessage(SocketEventKeys.FETCH_MESSAGE)
  //   async fetchListMessage(client: Socket, body: FetchListMessageDto) {
  //     this.utilsService.assignPaging(body);
  //     const result = await this.socketService.fetchListMessage(client.data.id, body);
  //     return this.utilsService.socketSuccess(SocketEventKeys.FETCH_MESSAGE, client.data.id, result);
  //   }

  //   @SubscribeMessage(SocketEventKeys.SEND_MESSAGE)
  //   async sendMessage(client: Socket, body: SendMessageDto) {
  //     if (!body.content && !body.attachmentUrl) {
  //       throw new WsExceptionNew(ErrorCustom.Invalid_Input);
  //     }

  //     const { message, allMemberInConversation, member } = await this.socketService.sendMessage(client.data.id, body);

  //     const convertMessage = JSON.parse(JSON.stringify(message));
  //     Object.assign(convertMessage, { member });
  //     // Send event to all member join conversation
  //     this.server.to(this.generateConversationRoom(body.conversationId)).emit(SocketEventKeys.NEW_MESSAGE, {
  //       id: body.conversationId,
  //       type: ActionConversationType.NEW_MESSAGE,
  //       message: convertMessage,
  //     });

  //     // Send all member active in conversation

  //     allMemberInConversation.forEach((memberId) => {
  //       this.server.to(this.generateMemberRoom(memberId)).emit(SocketEventKeys.CONVERSATION, {
  //         id: body.conversationId,
  //         type: ActionConversationType.NEW_MESSAGE,
  //         message: convertMessage,
  //       });
  //     });

  //     return this.utilsService.socketSuccess(SocketEventKeys.SEND_MESSAGE, client.data.id, convertMessage);
  //   }

  //   /* ----------- update time last time view message in conversation ----------- */
  //   @SubscribeMessage(SocketEventKeys.UPDATE_LAST_TIME_VIEW)
  //   async updateLastTimeView(client: Socket, body: UpdateLastTimeViewDto) {
  //     const result = await this.socketService.updateLastTimeView(client.data.id, body);
  //     this.server.to(this.generateMemberRoom(client.data.id)).emit(SocketEventKeys.CONVERSATION, {
  //       id: body.conversationId,
  //       type: ActionConversationType.UPDATE_LAST_TIME_VIEW,
  //       lastTimeView: result,
  //     });
  //     return this.utilsService.socketSuccess(SocketEventKeys.UPDATE_LAST_TIME_VIEW, client.data.id, result);
  //   }
}
