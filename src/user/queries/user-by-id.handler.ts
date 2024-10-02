import { IInferredQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UserRepository } from '../db/user.repository';
import { User } from '../user';
import { UserByIdQuery } from './user-by-id.query';

@QueryHandler(UserByIdQuery)
export class UserByIdHandler implements IInferredQueryHandler<UserByIdQuery> {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(query: UserByIdQuery): Promise<User> {
    const user = await this.userRepository.findById(query.props.id);

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }
}
