// import { Module } from '@nestjs/common';
// import { MessageProviderService } from './message-provider.service';
// import { MongooseModule } from '@nestjs/mongoose';
// import { ConversationMember, ConversationMemberSchema } from '@app/database-mongodb/schemas/conversation-member.schema';
// import { Conversation, ConversationSchema } from '@app/database-mongodb/schemas/conversation.shema';
// import { Message, MessageSchema } from '@app/database-mongodb/schemas/message.schema';
// import { Member, MemberSchema } from '@app/database-mongodb/schemas/member.schema';

// @Module({
//   imports: [
//     MongooseModule.forFeature([
//       { name: ConversationMember.name, schema: ConversationMemberSchema },
//       { name: Conversation.name, schema: ConversationSchema },
//       { name: Message.name, schema: MessageSchema },
//       { name: Member.name, schema: MemberSchema },
//     ]),
//   ],
//   providers: [MessageProviderService],
//   exports: [MessageProviderService],
// })
// export class MessageProviderModule {}
