import { InteractionType } from '@/domain/entities/interaction.entity';
import InteractionService from '@/domain/services/interaction.service';
import LiteratureService from '@/domain/services/literature.service';
import PericopeService from '@/domain/services/pericope.service';
import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Inject,
    Param,
    Patch,
    Post,
    Query,
    Req,
    Request,
    UseFilters,
    UseGuards,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiCreatedResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
} from '@nestjs/swagger';
import { RequestCreateLiterature } from '../dtos/pericope/create-pericope.dto';
import FilterPericopeDto from '../dtos/pericope/filter.dto';
import PericopeUserDto from '../dtos/pericope/pericope-user.dto';
import PericopeDto from '../dtos/pericope/pericope.dto';
import { PericopePreview } from '../dtos/pericope/preicope-preview.dto';
import { HttpExceptionFilter } from '../filters/http-exception.filter';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@ApiBearerAuth()
@ApiTags('pericope')
@Controller('pericopes')
export class PericopeController {
    constructor(
        @Inject(LiteratureService) private literatureService: LiteratureService,
        @Inject(PericopeService) private pericopeService: PericopeService,
        @Inject(InteractionService)
        private interactionService: InteractionService,
    ) {}

    @ApiOperation({
        description:
            'It creates a pericope and adds it to a literature as a draft',
    })
    @ApiCreatedResponse({ description: 'Pericope created.' })
    @UseGuards(JwtAuthGuard)
    @Post('')
    @HttpCode(201)
    async createPericope(
        @Request() req,
        @Body() { text, literature }: RequestCreateLiterature,
    ) {
        const pericope = await this.pericopeService.createPericope({
            text,
            literature,
            user: req.user.id,
        });

        return PericopeDto.toDto(pericope);
    }

    @ApiOperation({
        description: 'It searches all pericopes of a literature',
    })
    @ApiCreatedResponse({ description: 'Searching completed' })
    @UseGuards(JwtAuthGuard)
    @Get('/literature/:id')
    @HttpCode(200)
    async getPericopesByFilter(
        @Req() req,
        @Param('id') id: string,
        @Query() filter: FilterPericopeDto,
    ) {
        const pericopes = await this.pericopeService.findPericopesByLiterature(
            id,
            filter,
        );

        return PericopeUserDto.toDtos(pericopes, req.user.id);
    }

    @ApiOperation({
        description: 'It gets all pericopes from a user',
    })
    @ApiCreatedResponse({ description: 'Pericope created.' })
    @UseGuards(JwtAuthGuard)
    @Get('/self')
    @HttpCode(200)
    async getPericopesByUser(@Req() req): Promise<PericopePreview[]> {
        const pericopes = await this.pericopeService.findPericopesByUser(
            req.user.id,
        );

        return PericopePreview.toDtos(pericopes);
    }

    @ApiOperation({
        description: 'It gets a pericope by its id',
    })
    @ApiCreatedResponse({ description: 'Pericope created.' })
    @UseGuards(JwtAuthGuard)
    @Get('/:id')
    @HttpCode(200)
    async getPericopeById(@Param('id') pericopeId: string) {
        const pericope = await this.pericopeService.findPericopeById(
            pericopeId,
        );

        return PericopeDto.toDto(pericope);
    }

    @ApiOperation({
        description: 'It adds a pericope to literature timeline',
    })
    @ApiCreatedResponse({ description: 'Pericope created.' })
    @UseGuards(JwtAuthGuard)
    @Patch('/timeline/:id')
    @HttpCode(200)
    async addPericopeToTimeline(@Param('id') pericopeId: string) {
        await this.pericopeService.addPericopeToTimeline(pericopeId);
    }

    @ApiOperation({
        description: 'Register a view interaction to a literature',
    })
    @ApiOkResponse()
    @UseGuards(JwtAuthGuard)
    @Patch('/view/:id')
    @HttpCode(200)
    async registerViewToLiterature(
        @Request() req,
        @Param('id') pericopeId: string,
    ) {
        const interaction = await this.interactionService.findInteraction({
            user: req.user.id,
            type: InteractionType.VIEW,
            pericope: pericopeId,
        });

        if (!interaction) {
            await this.interactionService.createInteraction({
                type: InteractionType.VIEW,
                user: req.user.id,
                pericope: pericopeId,
            });
        }
    }

    @ApiOperation({
        description: 'Register a view interaction to a pericope',
    })
    @ApiOkResponse()
    @UseGuards(JwtAuthGuard)
    @Patch('/like/:id')
    @HttpCode(200)
    @UseFilters(new HttpExceptionFilter())
    async registerLikeToLiterature(
        @Request() req,
        @Param('id') pericopeId: string,
    ) {
        const interaction = await this.interactionService.findInteraction({
            user: req.user.id,
            type: InteractionType.LIKE,
            pericope: pericopeId,
        });

        if (!interaction) {
            await this.interactionService.createInteraction({
                type: InteractionType.LIKE,
                user: req.user.id,
                pericope: pericopeId,
            });
        } else {
            await this.interactionService.removeInteraction(interaction);
        }
    }

    @ApiOperation({
        description: 'It gets all pericopes from a user',
    })
    @ApiCreatedResponse({ description: 'Pericope removed.' })
    @UseGuards(JwtAuthGuard)
    @Delete('/:id')
    @HttpCode(204)
    async removePericopeById(@Param('id') pericopeId: string) {
        await this.pericopeService.removePericopeById(pericopeId);
    }
}
