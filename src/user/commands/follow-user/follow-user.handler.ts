import { CommandHandler, IInferredCommandHandler } from '@nestjs/cqrs';
import { IdService } from 'src/common/id.service';
import { FollowerRepository } from 'src/user/db/follower.repository';
import { UserRepository } from 'src/user/db/user.repository';
import { Follower } from 'src/user/follower';
import { FollowUserCommand } from './follow-user.command';

@CommandHandler(FollowUserCommand)
export class FollowUserHandler
  implements IInferredCommandHandler<FollowUserCommand>
{
  constructor(
    private readonly repository: FollowerRepository,
    private readonly userRepository: UserRepository,
    private readonly idService: IdService,
  ) {}

  async execute({
    props: { followerId, followingUsername },
  }: FollowUserCommand): Promise<void> {
    const user = await this.userRepository.findByUsername(followingUsername);

    if (!user) {
      throw new Error('User not found');
    }

    const id = this.idService.generateId();
    const follower = Follower.create({
      id,
      props: { followerId, followingId: user.id },
    });

    await this.repository.insert(follower);
  }
}
