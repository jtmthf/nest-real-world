import { CommandHandler, IInferredCommandHandler } from '@nestjs/cqrs';
import { PasswordService } from 'src/auth/password.service';
import { UserRepository } from 'src/user/db/user.repository';
import { User } from 'src/user/user';
import { UpdateUserCommand } from './update-user.command';

@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler
  implements IInferredCommandHandler<UpdateUserCommand>
{
  constructor(
    private readonly repository: UserRepository,
    private readonly passwordService: PasswordService,
  ) {}

  async execute({
    props: { password, ...props },
  }: UpdateUserCommand): Promise<User> {
    const user = await this.repository.findById(props.userId);

    if (!user) {
      throw new Error('User not found');
    }

    user.update({
      ...props,
      passwordHash: password
        ? await this.passwordService.hashPassword(password)
        : undefined,
    });

    return await this.repository.update(user);
  }
}
