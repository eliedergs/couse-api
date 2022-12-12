import CreateUserDto from '@/application/dtos/user/create-user.dto';
import { AuthService } from '@domain/services/auth.service';
import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Inject,
    Post,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import AuthDto from '../dtos/auth/auth.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(@Inject(AuthService) private authService: AuthService) {}

    @ApiOperation({
        description: 'Register a new user and return its access token',
    })
    @ApiCreatedResponse({ description: 'User created and logged.' })
    @Post('/register')
    @HttpCode(HttpStatus.CREATED)
    async createUser(@Body() credentials: CreateUserDto) {
        return await this.authService.registerUser(credentials);
    }

    @ApiOperation({
        description: 'Validate credentials and return an access token',
    })
    @ApiCreatedResponse({ description: 'User created and logged.' })
    @Post('/login')
    @HttpCode(HttpStatus.OK)
    async loginUser(
        @Body() authDto: AuthDto,
    ): Promise<{ id: string; token: string }> {
        return await this.authService.validateLogin(authDto);
    }
}
