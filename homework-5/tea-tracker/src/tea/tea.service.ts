import {Injectable, Logger, NotFoundException, OnApplicationShutdown} from '@nestjs/common';
import {Tea, TeaListResponse, UpdateTea} from "./entities/tea.entity";
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TeaService implements OnApplicationShutdown {

    private readonly logger = new Logger(TeaService.name);

    onApplicationShutdown(signal: string) {
        if (signal === 'SIGINT') {
            this.logger.log('Bye tea‑lovers 👋');
        }
    }

    private teas:Tea[] = [];

    findAll(minRating?: number, page = 1, pageSize = 10):TeaListResponse {
        let filtered = this.teas;
        if (minRating) {
            filtered = filtered.filter(t => (t.rating ?? 0)  >= minRating);
        }
        const total = filtered.length;
        const startIndex = (page - 1) * pageSize;
        const endIndex = page * pageSize;
        const data = filtered.slice(startIndex, endIndex);
        return { totalPages: Math.ceil(total / pageSize), totalItems: total, data };
    }

    findOne(id: string): Tea {
        const tea = this.teas.find(tea => tea.id === id);
        if (!tea) throw new NotFoundException('Tea not found');
        return tea;
    }

    create(dto: Omit<Tea, 'id'>): Tea {
        const tea = { id: uuidv4(), ...dto };
        this.teas.push(tea);
        return tea;
    }

    update(id: string, dto: UpdateTea): Tea {
        const tea = this.teas.find(t => t.id === id);
        if (!tea) throw new NotFoundException();

        (Object.entries(dto) as [keyof UpdateTea, any][]).forEach(([key, value]) => {
            if (value !== undefined) {
                (tea as Record<keyof UpdateTea, any>)[key] = value;
            }
        });

        return tea
    }

    remove(id: string) {
        const currentTea = this.teas.find(t => t.id === id);
        if (!currentTea) throw new NotFoundException();

        this.teas = this.teas.filter(tea => tea.id !== currentTea.id);
    }
}
