import { Query } from '@nestjs-architects/typed-cqrs';
import { User } from '../user';

export interface UserByIdProps {
  id: string;
}

export class UserByIdQuery extends Query<User> {
  props: UserByIdProps;

  constructor(props: UserByIdProps) {
    super();
    this.props = props;
  }
}
