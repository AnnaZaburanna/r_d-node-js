export class BrewsController {
    static scope = 'scoped';

    constructor(brewsService) {
        console.log(`BrewsController initialized`);
        this.brewsService = brewsService;
    }

    index  = (_req, res) => {
        const {method, ratingMin} = _req.query;

        const brews = this.brewsService.getAll();

        if (!method && ratingMin === undefined) {
            return res.json(brews);
        }

        const filteredByMethod = method
            ? brews.filter(brew => brew.method === method)
            : brews;

        const filteredByRating = ratingMin !== undefined
            ? (() => {
                const min = Number(ratingMin);
                return isNaN(min)
                    ? filteredByMethod
                    : filteredByMethod.filter(brew => brew.rating !== undefined && brew.rating >= min);
            })()
            : filteredByMethod;

        return res.json(filteredByRating);
    }

    show = (req, res) =>
        res.json(this.brewsService.getOne(req.params.id));

    create = (req, res) =>
        res.status(201).json(this.brewsService.create(req.body));

    update = (req, res) =>
        res.json(this.brewsService.update(req.params.id, req.body));

    remove = (req, res) => {
        this.brewsService.delete(req.params.id);
        res.status(204).end();
    };
}