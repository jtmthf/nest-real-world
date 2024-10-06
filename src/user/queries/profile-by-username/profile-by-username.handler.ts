import { IInferredQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UserRepository } from '../../db/user.repository';
import { Profile } from '../../domain/value-objects/profile.value-object';
import { ProfileByUsernameQuery } from './profile-by-username.query';

@QueryHandler(ProfileByUsernameQuery)
export class ProfileByUsernameHandler
  implements IInferredQueryHandler<ProfileByUsernameQuery>
{
  constructor(private readonly userRepository: UserRepository) {}

  async execute(query: ProfileByUsernameQuery): Promise<Profile> {
    const profile = await this.userRepository.findProfileByUsername(
      query.props.username,
      query.props.userId,
    );

    if (!profile) {
      throw new Error('Profile not found');
    }

    return profile;
  }
}
