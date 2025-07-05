export class Tea {
    id: string;
    name: string;
    origin: string;
    rating?: number;
    brewTemp?: number;
    notes?: string;
}

export type UpdateTea = Partial<Pick<Tea, keyof Omit<Tea, 'id'>>>

export type TeaListResponse = {
    totalPages: number;
    totalItems: number,
    data: Tea[]
}