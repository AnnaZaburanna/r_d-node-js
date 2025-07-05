import { Controller, Delete, Get, Param, Post, Put, Query, UseGuards} from '@nestjs/common';
import {TeaService} from "./tea.service";
import {CreateTeaDto, SwaggerCreateTeaDto, SwaggerUpdateTeaDto, UpdateTeaDto} from "./dto/tea.dto";
import {Zbody} from "./shared/decorators/zbody";
import {ApiBody, ApiQuery, ApiSecurity, ApiTags} from "@nestjs/swagger";
import {Throttle, ThrottlerGuard} from "@nestjs/throttler";
import {Public} from "./shared/decorators/public";
import {Tea, UpdateTea} from "./entities/tea.entity";

@ApiTags('Tea')
@ApiSecurity('x-api-key')
@Controller('tea')
export class TeaController {
    constructor(private readonly teas: TeaService) {}

    @Get()
    @Public()
    @ApiQuery({ name: 'minRating', required: false })
    @ApiQuery({ name: 'page', required: false })
    @ApiQuery({ name: 'pageSize', required: false })
    findAll(
        @Query('minRating') minRating?: number,
        @Query('page') page = 1,
        @Query('pageSize') pageSize = 10,
        ) {
        return this.teas.findAll(Number(minRating), Number(page), Number(pageSize));
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.teas.findOne(id)
    }

    @Post()
    @UseGuards(ThrottlerGuard)
    @Throttle({default: { limit: 10, ttl: 60000 }})
    @ApiBody({type: SwaggerCreateTeaDto})
    create(@Zbody(CreateTeaDto) dto: Omit<Tea, 'id'>) {
        return this.teas.create(dto)
    }

    @Put(':id')
    @ApiBody({type: SwaggerUpdateTeaDto})
    update(@Param('id') id:string, @Zbody(UpdateTeaDto) dto: UpdateTea ) {
        return this.teas.update(id, dto)
    }

    @Delete(':id')
    remove(@Param('id') id:string) {
        return this.teas.remove(id)
    }
}
