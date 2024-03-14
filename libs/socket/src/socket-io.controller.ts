// import { Controller, Get } from '@nestjs/common';
// import { Public } from 'libs/jwt-authentication/src/jwt-authentication.decorator';
// import { EventsGateway } from './events.gateway';
// @Controller('message')
// export class MessageController {
//   constructor(private readonly eventGateway: EventsGateway) {}

//   @Get('/test')
//   @Public()
//   async test() {
//     return await this.eventGateway.getSocketIdsByMemberId(5);
//   }
// }
