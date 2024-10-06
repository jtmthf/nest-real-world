import { Command } from '@nestjs-architects/typed-cqrs';

export interface UnfollowUserProps {
  followerId: string;
  followingUsername: string;
}

export class UnfollowUserCommand extends Command<void> {
  props: UnfollowUserProps;

  constructor(props: UnfollowUserProps) {
    super();
    this.props = props;
  }
}
