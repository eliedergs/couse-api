import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('interaction')
@Controller('interaction')
export class InteractionController {
    constructor() {}
}
