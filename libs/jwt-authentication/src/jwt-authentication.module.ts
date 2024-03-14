import { JwtAuthenticationService } from './jwt-authentication.service';
import { ConfigurableModuleClass } from './jwt-authentication.module-definition';
import { JwtModule } from '@nestjs/jwt';
import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Global()
@Module({
  imports: [ConfigModule, JwtModule],
  providers: [JwtAuthenticationService],
  exports: [JwtAuthenticationService],
})
export class JwtAuthenticationModule extends ConfigurableModuleClass {}
