import { CommandHandler, IInferredCommandHandler } from '@nestjs/cqrs';
import { PasswordService } from 'src/auth/password.service';
import { IdService } from 'src/common/id.service';
import { UserRepository } from 'src/user/db/user.repository';
import { User } from 'src/user/user';
import { RegisterUserCommand } from './register-user.command';

@CommandHandler(RegisterUserCommand)
export class RegisterUserHandler
  implements IInferredCommandHandler<RegisterUserCommand>
{
  constructor(
    private readonly repository: UserRepository,
    private readonly idService: IdService,
    private readonly passwordService: PasswordService,
  ) {}

  async execute({
    props: { password, ...props },
  }: RegisterUserCommand): Promise<User> {
    const id = this.idService.generateId();
    const passwordHash = await this.passwordService.hashPassword(password);
    const user = User.create({ id, props: { ...props, passwordHash } });

    return await this.repository.insert(user);
  }
}
