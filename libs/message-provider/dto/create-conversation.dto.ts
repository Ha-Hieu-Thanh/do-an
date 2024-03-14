// import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';
// import { ConversationType } from '../../database-mongodb/src/schemas/conversation.shema';

// export class CreateConversationDto {
//   /**
//    * type ConversationType
//    * @example 2
//    */
//   @IsNotEmpty()
//   @IsEnum(ConversationType)
//   type: ConversationType;

//   /**
//    * name conversation
//    * @example hello kitty
//    */
//   @IsOptional()
//   @IsString()
//   @MaxLength(255)
//   name?: string;

//   /**
//    * avatar conversation
//    * @example https://example.com
//    */
//   @IsOptional()
//   @IsString()
//   @MaxLength(255)
//   avatar?: string;

//   /**
//    * created by id
//    * @example  2
//    */
//   @IsNotEmpty()
//   @IsInt()
//   @Min(1)
//   @Max(18446744073709550)
//   createdBy: number;
// }
