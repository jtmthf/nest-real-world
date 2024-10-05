import { Command } from '@nestjs-architects/typed-cqrs';
import { User } from 'src/user/user';

export interface UpdateUserProps {
  userId: string;
  username?: string;
  email?: string;
  password?: string;
  image?: string | null;
  bio?: string | null;
}

export class UpdateUserCommand extends Command<User> {
  props: UpdateUserProps;

  constructor(props: UpdateUserProps) {
    super();
    this.props = props;
  }
}
