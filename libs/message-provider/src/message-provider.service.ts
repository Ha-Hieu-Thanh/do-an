// import { ConversationMember, ConversationMemberStatus } from '@app/database-mongodb/schemas/conversation-member.schema';
// import { Conversation, ConversationType } from '@app/database-mongodb/schemas/conversation.shema';
// import { Member } from '@app/database-mongodb/schemas/member.schema';
// import { Message } from '@app/database-mongodb/schemas/message.schema';
// import { Injectable, Logger } from '@nestjs/common';
// import { InjectConnection, InjectModel } from '@nestjs/mongoose';
// import mongoose, { Model } from 'mongoose';
// export interface IDataMembers {
//   [key: number]: { id: number; name: string; avatar: string; status: number };
// }
// @Injectable()
// export class MessageProviderService {
//   private readonly logger = new Logger(MessageProviderService.name);
//   constructor(
//     @InjectModel(Conversation.name) private conversationModel: Model<Conversation>,
//     @InjectModel(ConversationMember.name) private conversationMemberModel: Model<ConversationMember>,
//     @InjectModel(Message.name) private messageModel: Model<Message>,
//     @InjectModel(Member.name) private memberModel: Model<Member>,
//     @InjectConnection() private readonly connection: mongoose.Connection,
//   ) {}

//   /**
//    * Create or update member information
//    */
//   async createMemberInformation(member: { id: number; name: string; status: number; [key: string]: any }) {
//     await this.memberModel.updateOne(
//       { id: member.id },
//       { $set: { id: member.id, name: member.name, status: member.status, avatar: member.avatar } },
//       { upsert: true },
//     );
//   }

//   async checkP2PConversationExists(memberId: number, targetId: number): Promise<Conversation | null> {
//     const conversationMemberP2P = await this.conversationMemberModel
//       .findOne({
//         conversationType: ConversationType.P2P,
//         $or: [
//           { memberId: memberId, targetId: targetId },
//           { memberId: targetId, targetId: memberId },
//         ],
//       })
//       .lean();

//     if (!conversationMemberP2P) return null;

//     return await this.conversationModel.findOne({ _id: conversationMemberP2P.conversationId }).lean();
//   }

//   async createNewConversation(
//     type: ConversationType,
//     createdBy: number,
//     memberIds: number[],
//   ): Promise<Conversation | void> {
//     if (memberIds?.length < 2) {
//       // TODO throw
//       return;
//     }

//     //TODO Handle basic data memberIds

//     const session = await this.connection.startSession();
//     session.startTransaction();
//     try {
//       const newConversation = await this.conversationModel.create(
//         [
//           {
//             createdBy,
//             type,
//           },
//         ],
//         { session },
//       );

//       const dataNewConversation = newConversation[0];
//       if (!dataNewConversation) {
//         // TODO throw
//         return;
//       }

//       if (type === ConversationType.GROUP) {
//       }

//       if (type === ConversationType.P2P) {
//         const [memberId, targetId] = memberIds;
//         const currentTime = new Date().getTime();
//         const dataConverSationMembers: ConversationMember[] =
//           memberId === targetId
//             ? [
//                 {
//                   conversationId: dataNewConversation._id.toString(),
//                   memberId,
//                   targetId,
//                   conversationType: type,
//                   getMessageFrom: currentTime,
//                   lastTimeView: currentTime,
//                 },
//               ]
//             : [
//                 {
//                   conversationId: dataNewConversation._id.toString(),
//                   memberId,
//                   targetId,
//                   conversationType: type,
//                   getMessageFrom: currentTime,
//                   lastTimeView: currentTime,
//                 },
//                 {
//                   conversationId: dataNewConversation._id.toString(),
//                   memberId: targetId,
//                   targetId: memberId,
//                   conversationType: type,
//                   getMessageFrom: currentTime,
//                   lastTimeView: currentTime,
//                 },
//               ];

//         await this.conversationMemberModel.create(dataConverSationMembers, { session });
//       }
//       await session.commitTransaction();

//       return dataNewConversation;
//     } catch (error) {
//       this.logger.log({ error });
//       await session.abortTransaction();
//     } finally {
//       await session.endSession();
//     }
//   }

//   async handleMemberInConversation(memberId: number, conversationId: string): Promise<ConversationMember | null> {
//     return await this.conversationMemberModel.findOne({ memberId, conversationId });
//   }

//   async createMessage(
//     memberId: number,
//     conversationId: string,
//     data: { content?: string; attachmentUrl?: string },
//   ): Promise<Message> {
//     const message = await this.messageModel
//       .create(<Message>{
//         conversationId,
//         memberId,
//         payload: {},
//         ...data,
//       })
//       .finally();
//     await this.conversationModel.updateOne({ _id: conversationId }, { lastMessage: message._id }, { upsert: true });
//     await this.conversationMemberModel.updateMany(
//       { conversationId, status: ConversationMemberStatus.ACTIVE },
//       { lastActiveAt: new Date().getTime() },
//       { upsert: true },
//     );
//     return message;
//   }

//   async getAllMembersActiveInConversation(conversationId: string, memberIdsIgnore: number[]) {
//     const members = await this.conversationMemberModel.find(
//       {
//         conversationId,
//         status: ConversationMemberStatus.ACTIVE,
//         memberId: { $nin: memberIdsIgnore },
//       },
//       '_id memberId',
//     );

//     return members.map((item) => item.memberId);
//   }

//   //
//   async fetchListConversation(memberId: number, body: any) {
//     return this.conversationMemberModel
//       .aggregate([
//         {
//           $match: {
//             memberId: memberId,
//             lastActiveAt: { $lt: body.lastActiveAt || new Date().getTime() }, // Lọc dữ liệu với điều kiện time < yourSpecificTime
//           },
//         },
//         {
//           $sort: {
//             lastActiveAt: -1, // Sắp xếp theo trường time giảm dần
//           },
//         },
//         {
//           $limit: body.pageSize || 10,
//         },
//         {
//           $lookup: {
//             from: 'conversations',
//             localField: 'conversationId',
//             foreignField: '_id',
//             as: 'conversationData',
//           },
//         },
//         {
//           $lookup: {
//             from: 'members',
//             localField: 'targetId',
//             foreignField: 'id',
//             as: 'target',
//           },
//         },
//         {
//           $project: {
//             _id: 0,
//             conversationId: 1,
//             conversationType: 1,
//             memberId: 1,
//             status: 1,
//             lastTimeView: 1,
//             target: { $arrayElemAt: ['$target', 0] },
//             conversationData: {
//               $arrayElemAt: ['$conversationData', 0], // Lấy phần tử đầu tiên trong mảng
//             },
//             lastMessage: {
//               $cond: [{ $eq: ['$status', 1] }, '$conversationData.lastMessage', '$lastMessage'],
//             },
//           },
//         },
//         {
//           $addFields: {
//             lastMessage: {
//               $cond: [{ $eq: ['$status', 1] }, '$conversationData.lastMessage', '$lastMessage'],
//             },
//           },
//         },
//         {
//           $lookup: {
//             from: 'messages',
//             localField: 'lastMessage',
//             foreignField: '_id',
//             as: 'lastMessageData',
//           },
//         },
//         {
//           $unwind: '$lastMessageData',
//         },
//         {
//           $lookup: {
//             from: 'members',
//             localField: 'lastMessageData.memberId',
//             foreignField: 'id',
//             as: 'lastMessageData.member',
//           },
//         },
//         {
//           $unwind: '$lastMessageData.member',
//         },
//         {
//           $addFields: {
//             lastMessageCreatedAt: '$lastMessageData.createdAt',
//           },
//         },
//         {
//           $project: {
//             lastMessage: 0, // Loại bỏ trường tạm thời
//             conversationData: {
//               _id: 0,
//               createdAt: 0,
//               updatedAt: 0,
//               __v: 0,
//               lastMessage: 0,
//             },
//             lastMessageData: {
//               lastMessageData: 0,
//               updatedAt: 0,
//               __v: 0,
//               member: {
//                 _id: 0,
//                 id: 0,
//                 createdAt: 0,
//                 updatedAt: 0,
//                 __v: 0,
//               },
//             },
//             target: {
//               createdAt: 0,
//               updatedAt: 0,
//               __v: 0,
//             },
//           },
//         },
//       ])
//       .exec();
//   }

//   async fetchListMessage(memberId: number, body: any) {
//     const conversationId = body.conversationId;

//     const lastMessageIsView = await this.conversationMemberModel
//       .aggregate([
//         {
//           $match: {
//             memberId: memberId,
//             conversationId: new mongoose.Types.ObjectId(conversationId),
//           },
//         },
//         {
//           $lookup: {
//             from: 'conversations',
//             localField: 'conversationId',
//             foreignField: '_id',
//             as: 'conversationData',
//           },
//         },
//         {
//           $unwind: '$conversationData',
//         },
//         {
//           $project: {
//             _id: 0,
//             lastMessage: {
//               $cond: [{ $eq: ['$status', 1] }, '$conversationData.lastMessage', '$lastMessage'],
//             },
//           },
//         },
//         {
//           $lookup: {
//             from: 'messages',
//             localField: 'lastMessage',
//             foreignField: '_id',
//             as: 'lastMessageData',
//           },
//         },
//         {
//           $unwind: '$lastMessageData',
//         },
//         {
//           $addFields: {
//             lastMessageCreatedAt: '$lastMessageData.createdAt',
//           },
//         },
//         {
//           $limit: 1,
//         },
//         {
//           $project: {
//             lastMessageCreatedAt: 1,
//           },
//         },
//       ])
//       .exec();
//     const lastMessageCreatedAt = lastMessageIsView?.[0]?.['lastMessageCreatedAt'];
//     const lastItemCreatedAt = body.lastItemCreatedAt
//       ? body.lastItemCreatedAt < lastMessageCreatedAt
//         ? body.lastItemCreatedAt
//         : lastMessageCreatedAt
//       : lastMessageCreatedAt;

//     const createdAtMatch =
//       lastMessageCreatedAt === lastItemCreatedAt ? { $lte: lastItemCreatedAt } : { $lt: lastItemCreatedAt };
//     return this.messageModel
//       .aggregate([
//         {
//           $match: {
//             conversationId: new mongoose.Types.ObjectId(conversationId),
//             createdAt: createdAtMatch,
//           },
//         },
//         {
//           $sort: {
//             createdAt: -1, // Sắp xếp theo trường createdAt giảm dần
//           },
//         },
//         {
//           $limit: body.pageSize || 10,
//         },
//         {
//           $lookup: {
//             from: 'members',
//             localField: 'memberId',
//             foreignField: 'id',
//             as: 'member',
//           },
//         },
//         {
//           $unwind: '$member',
//         },
//         {
//           $project: {
//             member: {
//               _id: 0,
//               id: 0,
//               createdAt: 0,
//               updatedAt: 0,
//               __v: 0,
//             },
//           },
//         },
//       ])
//       .exec();
//   }
//   async _getDataMembers(memberIds: number[]): Promise<{ count: number; membersById: IDataMembers }> {
//     const members = await this.memberModel
//       .find({ id: { $in: memberIds } }, { id: true, name: true, avatar: true, status: true })
//       .lean();
//     const membersById = members.reduce((acc, cur) => {
//       acc[cur.id] = cur;
//       return acc;
//     }, {});

//     return {
//       count: members.length,
//       membersById,
//     };
//   }

//   async updateConversationMembers(conversationId: string, memberIds: number[], dataUpdate: any) {
//     await this.conversationMemberModel.updateMany({ conversationId, memberId: { $in: memberIds } }, dataUpdate);
//   }
// }
