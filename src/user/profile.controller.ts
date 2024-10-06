import { Controller, Get, Param } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiResponse, ApiResponseOptions, ApiTags } from '@nestjs/swagger';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';
import { Public } from 'src/common/decorators/public.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { ProfileByUsernameQuery } from './queries/profile-by-username/profile-by-username.query';
import { profileResponseJsonSchema } from './schemas/profile.schema';

@Controller()
@ApiTags('profile')
export class ProfileController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get('profiles/:username')
  @Public()
  @ApiResponse({
    status: 200,
    description: 'Get profile',
    schema: profileResponseJsonSchema,
  } as ApiResponseOptions)
  async getProfile(
    @User() user: JwtPayload | undefined,
    @Param('username') username: string,
  ) {
    const profile = await this.queryBus.execute(
      new ProfileByUsernameQuery({ username, userId: user?.sub }),
    );

    return { profile };
  }
}
