import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthModule } from 'src/auth/auth.module';
import { LoginUserHandler } from './commands/login-user/login-user.handler';
import { RegisterUserHandler } from './commands/register-user/register-user.handler';
import { UserRepository } from './db/user.repository';
import { UserByIdHandler } from './queries/user-by-id.handler';
import { UserController } from './user.controller';

const CommandHandlers = [RegisterUserHandler, LoginUserHandler];
const QueryHandlers = [UserByIdHandler];

@Module({
  imports: [CqrsModule, AuthModule],
  providers: [...CommandHandlers, ...QueryHandlers, UserRepository],
  controllers: [UserController],
})
export class UserModule {}
