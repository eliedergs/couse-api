import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './application/guards/jwt-auth.guard';

@Controller()
export class AppController {
    @Get()
    getStatus(): string {
        return `Everything is working!`;
    }
}
