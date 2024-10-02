import { Body, Controller, HttpCode, Post, UsePipes } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  ApiBody,
  ApiBodyOptions,
  ApiResponse,
  ApiResponseOptions,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from 'src/auth/auth.service';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { LoginUserCommand } from './commands/login-user/login-user.command';
import { RegisterUserCommand } from './commands/register-user/register-user.command';
import {
  LoginUserDto,
  loginUserJsonSchema,
  loginUserResponseJsonSchema,
  loginUserResponseSchema,
  loginUserSchema,
} from './schemas/login-user.schema';
import {
  RegisterUserDto,
  registerUserJsonSchema,
  registerUserResponseJsonSchema,
  registerUserResponseSchema,
  registerUserSchema,
} from './schemas/register-user.schema';

@Controller()
@ApiTags('user')
export class UserController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly authService: AuthService,
  ) {}

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
    const token = await this.authService.generateToken(result);

    return registerUserResponseSchema.parse({
      user: {
        ...result.props,
        token,
      },
    });
  }

  @Post('users/login')
  @HttpCode(200)
  @ApiBody({ schema: loginUserJsonSchema } as ApiBodyOptions)
  @ApiResponse({
    status: 200,
    description: 'User logged in',
    schema: loginUserResponseJsonSchema,
  } as ApiResponseOptions)
  @UsePipes(new ZodValidationPipe(loginUserSchema))
  async loginUser(@Body() { user }: LoginUserDto) {
    const result = await this.commandBus.execute(new LoginUserCommand(user));
    const token = await this.authService.generateToken(result);

    return loginUserResponseSchema.parse({
      user: {
        ...result.props,
        token,
      },
    });
  }
}
