import UserService from '@/domain/services/user.service';
import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Inject,
    Param,
    Put,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import UpdateUserDto from '../dtos/user/update-user.dto';
import UserDto from '../dtos/user/user.dto';

@ApiTags('user')
@Controller('users')
export class UserController {
    constructor(@Inject(UserService) private userService: UserService) {}

    @ApiOperation({ description: 'Get profile user info by id' })
    @ApiOkResponse({ description: 'User info has been find and returned' })
    @Get(':id')
    @HttpCode(HttpStatus.OK)
    async createUser(@Param('id') id: string): Promise<UserDto> {
        const user = await this.userService.findById(id);

        return UserDto.toDto(user);
    }

    @ApiOperation({ description: 'Updates user data' })
    @ApiOkResponse({ description: 'User info has been updated' })
    @Put(':id')
    @HttpCode(HttpStatus.OK)
    async updateUser(
        @Param('id') id: string,
        @Body() { password, ...userDto }: UpdateUserDto,
    ) {
        await this.userService.updateUserById(id, userDto);
        if (!!password) await this.userService.updatePassword(id, password);
    }
}
