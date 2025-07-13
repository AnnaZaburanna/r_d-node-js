import {PipeTransform} from "../../core/decorators";
import {ArgumentMetadata} from "../../core/types";

export class ParseIntPipe implements PipeTransform<string, number> {
    transform(value: string, metadata: ArgumentMetadata): number {
        const val = parseInt(value, 10);
        if (isNaN(val)) {
            throw new Error(`Validation failed. "${value}" is not an integer`);
        }
        return val;
    }
}