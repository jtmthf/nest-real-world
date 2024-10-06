import { CommandHandler, IInferredCommandHandler } from '@nestjs/cqrs';
import { FollowerRepository } from 'src/user/db/follower.repository';
import { UnfollowUserCommand } from './unfollow-user.command';

@CommandHandler(UnfollowUserCommand)
export class UnfollowUserHandler
  implements IInferredCommandHandler<UnfollowUserCommand>
{
  constructor(private readonly repository: FollowerRepository) {}

  async execute({
    props: { followerId, followingUsername },
  }: UnfollowUserCommand): Promise<void> {
    const follower = await this.repository.findByFollowerIdAndFollowingUsername(
      followerId,
      followingUsername,
    );

    if (!follower) {
      throw new Error('Follower not found');
    }

    follower.delete();

    await this.repository.delete(follower);
  }
}
