
export class BrewsService {
    static scope = 'scoped';
    constructor(brewsModel) {
        console.log(`BrewsService initialized`);
        this.brewsModel = brewsModel;
    }

    getAll({method, ratingMin}) {

        const brews = this.brewsModel.all();
        if (!method && ratingMin === undefined) {
            return brews;
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

        return filteredByRating;
    }

    getOne(id) {
        const user = this.brewsModel.find(id);
        if (!user) throw Object.assign(new Error('Brew is not found'), { status: 404 });
        return user;
    }

    create(dto) {
        return this.brewsModel.create(dto);
    }

    update(id, dto) {
        const user = this.brewsModel.update(id, dto);
        if (!user) throw Object.assign(new Error('Brew is not found'), { status: 404 });
        return user;
    }

    delete(id) {
        if (!this.brewsModel.remove(id))
            throw Object.assign(new Error('Brew is not found'), { status: 404 });
    }
}