import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthModule } from 'src/auth/auth.module';
import { RegisterUserHandler } from './commands/register-user/register-user.handler';
import { UserRepository } from './db/user.repository';
import { UserController } from './user.controller';

const CommandHandlers = [RegisterUserHandler];

@Module({
  imports: [CqrsModule, AuthModule],
  providers: [...CommandHandlers, UserRepository],
  controllers: [UserController],
})
export class UserModule {}
