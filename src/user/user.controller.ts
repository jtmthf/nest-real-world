import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Put,
  UsePipes,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ApiBody,
  ApiBodyOptions,
  ApiResponse,
  ApiResponseOptions,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from 'src/auth/auth.service';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';
import { Public } from 'src/common/decorators/public.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { LoginUserCommand } from './commands/login-user/login-user.command';
import { RegisterUserCommand } from './commands/register-user/register-user.command';
import { UpdateUserCommand } from './commands/update-user/update-user.command';
import { UserByIdQuery } from './queries/user-by-id/user-by-id.query';
import {
  LoginUserDto,
  loginUserJsonSchema,
  loginUserSchema,
} from './schemas/login-user.schema';
import {
  RegisterUserDto,
  registerUserJsonSchema,
  registerUserSchema,
} from './schemas/register-user.schema';
import {
  UpdateUserDto,
  updateUserJsonSchema,
} from './schemas/update-user.schema';
import {
  UserResponseDto,
  userResponseJsonSchema,
  userResponseSchema,
} from './schemas/user.schema';

@Controller()
@ApiTags('user')
export class UserController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly authService: AuthService,
  ) {}

  @Post('users')
  @Public()
  @ApiBody({ schema: registerUserJsonSchema } as ApiBodyOptions)
  @ApiResponse({
    status: 201,
    description: 'User created',
    schema: userResponseJsonSchema,
  } as ApiResponseOptions)
  @UsePipes(new ZodValidationPipe(registerUserSchema))
  async registerUser(
    @Body() { user }: RegisterUserDto,
  ): Promise<UserResponseDto> {
    const result = await this.commandBus.execute(new RegisterUserCommand(user));
    const token = await this.authService.generateToken(result);

    return userResponseSchema.parse({
      user: {
        ...result.props,
        token,
      },
    });
  }

  @Post('users/login')
  @Public()
  @HttpCode(200)
  @ApiBody({ schema: loginUserJsonSchema } as ApiBodyOptions)
  @ApiResponse({
    status: 200,
    description: 'User logged in',
    schema: userResponseJsonSchema,
  } as ApiResponseOptions)
  @UsePipes(new ZodValidationPipe(loginUserSchema))
  async loginUser(@Body() { user }: LoginUserDto): Promise<UserResponseDto> {
    const result = await this.commandBus.execute(new LoginUserCommand(user));
    const token = await this.authService.generateToken(result);

    return userResponseSchema.parse({
      user: {
        ...result.props,
        token,
      },
    });
  }

  @Get('user')
  @ApiResponse({
    status: 200,
    description: 'User fetched',
    schema: userResponseJsonSchema,
  } as ApiResponseOptions)
  async currentUser(@User() user: JwtPayload): Promise<UserResponseDto> {
    const result = await this.queryBus.execute(
      new UserByIdQuery({ id: user.sub }),
    );
    const token = await this.authService.generateToken(result);

    return userResponseSchema.parse({
      user: {
        ...result.props,
        token,
      },
    });
  }

  @Put('user')
  @ApiBody({ schema: updateUserJsonSchema } as ApiBodyOptions)
  @ApiResponse({
    status: 200,
    description: 'User updated',
    schema: userResponseJsonSchema,
  } as ApiResponseOptions)
  async updateUser(
    @User() user: JwtPayload,
    @Body() { user: props }: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const result = await this.commandBus.execute(
      new UpdateUserCommand({ ...props, userId: user.sub }),
    );
    const token = await this.authService.generateToken(result);

    return userResponseSchema.parse({
      user: {
        ...result.props,
        token,
      },
    });
  }
}
