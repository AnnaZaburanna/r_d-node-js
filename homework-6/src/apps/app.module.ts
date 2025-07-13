import {Module} from "../core/decorators";
import {BooksModule} from "./books/books.module";
import {ZodValidationPipe} from "./pipes/zod.pipe";
import {ParseIntPipe} from "./pipes/parse-int.pipe";

@Module({
    imports: [BooksModule, ZodValidationPipe, ParseIntPipe],
})

export class AppModule {}