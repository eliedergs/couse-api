import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('notification')
@Controller('notification')
export class NotificationController {
    constructor() {}
}
