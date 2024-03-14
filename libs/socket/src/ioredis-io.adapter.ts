// import { IoAdapter } from '@nestjs/platform-socket.io';
// import { ServerOptions } from 'socket.io';
// import { createAdapter } from '@socket.io/redis-adapter';
// import Redis from 'ioredis';
// import { IConfigRedis } from '@app/helpers/config-env/configuration';

// export class RedisIoAdapter extends IoAdapter {
//   private adapterConstructor: ReturnType<typeof createAdapter>;

//   async connectToRedis(redisConfig: IConfigRedis): Promise<void> {
//     const pubClient = new Redis(redisConfig);

//     const subClient = pubClient.duplicate();

//     if (!pubClient.status.startsWith('connect') || !subClient.status.startsWith('connect')) {
//       await Promise.all([pubClient.connect(), subClient.connect()]);
//     }

//     this.adapterConstructor = createAdapter(pubClient, subClient);
//   }

//   createIOServer(port: number, options?: ServerOptions): any {
//     const server = super.createIOServer(port, options);
//     server.adapter(this.adapterConstructor);

//     return server;
//   }
// }
