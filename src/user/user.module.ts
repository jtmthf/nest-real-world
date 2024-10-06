import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthModule } from 'src/auth/auth.module';
import { FollowUserHandler } from './commands/follow-user/follow-user.handler';
import { LoginUserHandler } from './commands/login-user/login-user.handler';
import { RegisterUserHandler } from './commands/register-user/register-user.handler';
import { UpdateUserHandler } from './commands/update-user/update-user.handler';
import { FollowerRepository } from './db/follower.repository';
import { UserRepository } from './db/user.repository';
import { ProfileController } from './profile.controller';
import { ProfileByUsernameHandler } from './queries/profile-by-username/profile-by-username.handler';
import { UserByIdHandler } from './queries/user-by-id/user-by-id.handler';
import { UserController } from './user.controller';

const CommandHandlers = [
  RegisterUserHandler,
  LoginUserHandler,
  UpdateUserHandler,
  FollowUserHandler,
];
const QueryHandlers = [UserByIdHandler, ProfileByUsernameHandler];

@Module({
  imports: [CqrsModule, AuthModule],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    UserRepository,
    FollowerRepository,
  ],
  controllers: [UserController, ProfileController],
})
export class UserModule {}
