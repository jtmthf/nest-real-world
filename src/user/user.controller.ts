import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
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
import { AuthGuard } from 'src/auth/auth.guard';
import { AuthService } from 'src/auth/auth.service';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';
import { User } from 'src/common/decorators/user.decorator';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { LoginUserCommand } from './commands/login-user/login-user.command';
import { RegisterUserCommand } from './commands/register-user/register-user.command';
import { UserByIdQuery } from './queries/user-by-id.query';
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
    private readonly queryBus: QueryBus,
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

  @Get('user')
  @UseGuards(AuthGuard)
  @ApiResponse({
    status: 200,
    description: 'User fetched',
    schema: loginUserResponseJsonSchema,
  } as ApiResponseOptions)
  async currentUser(@User() user: JwtPayload) {
    const result = await this.queryBus.execute(
      new UserByIdQuery({ id: user.sub }),
    );
    const token = await this.authService.generateToken(result);

    return loginUserResponseSchema.parse({
      user: {
        ...result.props,
        token,
      },
    });
  }
}
