import { Command } from '@nestjs-architects/typed-cqrs';
import { User } from 'src/user/user';

export interface LoginUserProps {
  email: string;
  password: string;
}

export class LoginUserCommand extends Command<User> {
  props: LoginUserProps;

  constructor(props: LoginUserProps) {
    super();
    this.props = props;
  }
}
