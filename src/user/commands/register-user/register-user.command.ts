import { Command } from '@nestjs-architects/typed-cqrs';
import { User } from 'src/user/user';

export interface RegisterUserProps {
  username: string;
  email: string;
  password: string;
}

export class RegisterUserCommand extends Command<User> {
  props: RegisterUserProps;

  constructor(props: RegisterUserProps) {
    super();
    this.props = props;
  }
}
