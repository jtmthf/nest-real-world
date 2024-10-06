import { Command } from '@nestjs-architects/typed-cqrs';

export interface FollowUserProps {
  followerId: string;
  followingUsername: string;
}

export class FollowUserCommand extends Command<void> {
  props: FollowUserProps;

  constructor(props: FollowUserProps) {
    super();
    this.props = props;
  }
}
