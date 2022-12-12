import { InteractionType } from '@/domain/entities/interaction.entity';
import { PericopeType } from '@/domain/interfaces/literature';
import InteractionService from '@/domain/services/interaction.service';
import LiteratureService from '@/domain/services/literature.service';
import PericopeService from '@/domain/services/pericope.service';
import {
    Body,
    Controller,
    Get,
    HttpCode,
    Inject,
    Param,
    Patch,
    Post,
    Query,
    Req,
    Request,
    UseGuards,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiCreatedResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
} from '@nestjs/swagger';
import CreateLiteratureDto from '../dtos/literature/create-literature.dto';
import FilterLiteratureDto from '../dtos/literature/filter.dto';
import LiteraturePericopesInteractionCountingDto from '../dtos/literature/literature-pericopes-interactions-counting.dto';
import LiteraturePreviewDto from '../dtos/literature/literature-preview.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@ApiBearerAuth()
@ApiTags('literature')
@Controller('literatures')
export class LiteratureController {
    constructor(
        @Inject(LiteratureService) private literatureService: LiteratureService,
        @Inject(PericopeService) private pericopeService: PericopeService,
        @Inject(InteractionService)
        private interactionService: InteractionService,
    ) {}

    @ApiOperation({
        description:
            'It receives data to create a literature with a initial pericope',
    })
    @ApiCreatedResponse({ description: 'Literature initiated.' })
    @UseGuards(JwtAuthGuard)
    @Post('')
    @HttpCode(201)
    async initiateLiterature(
        @Request() req,
        @Body()
        { pericope: pericopeText, ...literatureDto }: CreateLiteratureDto,
    ): Promise<string> {
        const literature = await this.literatureService.createLiterature(
            literatureDto,
            req.user.id,
        );

        await this.pericopeService.createPericope({
            literature: literature.id,
            text: pericopeText,
            user: req.user.id,
            order: 1,
        });

        return literature.id;
    }

    @ApiOperation({
        description: 'List literatures by filter with its respective pericopes',
    })
    @ApiOkResponse({
        type: [LiteraturePreviewDto],
    })
    @UseGuards(JwtAuthGuard)
    @Get('/')
    @HttpCode(200)
    async getLiteratures(
        @Query()
        filter: FilterLiteratureDto = {},
    ): Promise<LiteraturePreviewDto[]> {
        const literatures =
            await this.literatureService.findLiteraturesByFilter(filter);

        return LiteraturePreviewDto.toDtos(literatures);
    }

    @ApiOperation({
        description: 'List literatures by filter with its respective pericopes',
    })
    @ApiOkResponse()
    @UseGuards(JwtAuthGuard)
    @Get('/self')
    @HttpCode(200)
    async getLiteraturesByUser(@Req() req): Promise<LiteraturePreviewDto[]> {
        const literatures = await this.literatureService.findLiteraturesByUser(
            req.user.id,
        );

        return LiteraturePreviewDto.toDtos(literatures);
    }

    @ApiOperation({
        description: 'List literatures by filter with its respective pericopes',
    })
    @ApiOkResponse()
    @UseGuards(JwtAuthGuard)
    @Get('/:id')
    @HttpCode(200)
    async getLiteratureById(
        @Req() req,
        @Param('id') literatureId: string,
        @Query('pericopeType') pericopeType: PericopeType = PericopeType.ALL,
    ): Promise<LiteraturePericopesInteractionCountingDto> {
        const literature = await this.literatureService.findLiteratureById(
            literatureId,
        );
        const hasAlreadyViewed = literature.interactions.find(
            (i) => i.user.id === req.user.id && i.type === InteractionType.VIEW,
        );

        if (!hasAlreadyViewed) {
            await this.interactionService.createInteraction({
                type: InteractionType.VIEW,
                user: req.user.id,
                literature: literatureId,
            });
        }

        const literatureDto = LiteraturePericopesInteractionCountingDto.toDto(
            literature,
            pericopeType,
            req.user.id,
        );

        return literatureDto;
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
        @Param('id') literatureId: string,
    ) {
        const interaction = await this.interactionService.findInteraction({
            user: req.user.id,
            type: InteractionType.VIEW,
            literature: literatureId,
        });

        if (!interaction) {
            await this.interactionService.createInteraction({
                type: InteractionType.VIEW,
                user: req.user.id,
                literature: literatureId,
            });
        }
    }

    @ApiOperation({
        description: 'Register a view interaction to a literature',
    })
    @ApiOkResponse()
    @UseGuards(JwtAuthGuard)
    @Patch('/like/:id')
    @HttpCode(200)
    async registerLikeToLiterature(
        @Request() req,
        @Param('id') literatureId: string,
    ) {
        const interaction = await this.interactionService.findInteraction({
            user: req.user.id,
            type: InteractionType.LIKE,
            literature: literatureId,
        });

        if (!interaction) {
            await this.interactionService.createInteraction({
                type: InteractionType.LIKE,
                user: req.user.id,
                literature: literatureId,
            });
        } else {
            await this.interactionService.removeInteraction(interaction);
        }
    }
}
