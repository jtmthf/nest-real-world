import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  ApiBody,
  ApiBodyOptions,
  ApiResponse,
  ApiResponseOptions,
  ApiTags,
} from '@nestjs/swagger';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { RegisterUserCommand } from './commands/register-user/register-user.command';
import {
  RegisterUserDto,
  registerUserJsonSchema,
  registerUserResponseJsonSchema,
  registerUserSchema,
} from './schemas/register-user.schema';

@Controller()
@ApiTags('user')
export class UserController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('users')
  @ApiBody({ schema: registerUserJsonSchema } as ApiBodyOptions)
  @ApiResponse({
    status: 201,
    description: 'User created',
    schema: registerUserResponseJsonSchema,
  } as ApiResponseOptions)
  @UsePipes(new ZodValidationPipe(registerUserSchema))
  async registerUser(@Body() { user }: RegisterUserDto) {
    const result = await this.commandBus.execute(new RegisterUserCommand(user));

    return {
      user: {
        email: result.props.email,
        username: result.props.username,
        bio: result.props.bio,
        image: result.props.image,
      },
    };
  }
}
