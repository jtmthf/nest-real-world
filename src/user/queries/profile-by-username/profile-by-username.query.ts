import { Query } from '@nestjs-architects/typed-cqrs';
import { Profile } from 'src/user/domain/value-objects/profile.value-object';

export interface ProfileByUsernameProps {
  userId?: string;
  username: string;
}

export class ProfileByUsernameQuery extends Query<Profile> {
  props: ProfileByUsernameProps;

  constructor(props: ProfileByUsernameProps) {
    super();
    this.props = props;
  }
}
