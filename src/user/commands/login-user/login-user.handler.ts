import { CommandHandler, IInferredCommandHandler } from '@nestjs/cqrs';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PasswordService } from 'src/auth/password.service';
import { UserRepository } from 'src/user/db/user.repository';
import { User } from 'src/user/user';
import { LoginUserCommand } from './login-user.command';

@CommandHandler(LoginUserCommand)
export class LoginUserHandler
  implements IInferredCommandHandler<LoginUserCommand>
{
  constructor(
    private readonly repository: UserRepository,
    private readonly passwordService: PasswordService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute({
    props: { email, password },
  }: LoginUserCommand): Promise<User> {
    const user = await this.repository.findByEmail(email);

    if (!user) {
      throw new Error('User not found');
    }

    const isValidPassword = await this.passwordService.verifyPassword(
      password,
      user.props.passwordHash,
    );

    if (!isValidPassword) {
      throw new Error('Invalid password');
    }

    user.login();
    await user.publishEvents(this.eventEmitter);

    return user;
  }
}
