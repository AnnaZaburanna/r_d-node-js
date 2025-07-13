import {Body, Controller, Get, Param, Post, UseGuards} from "../../core/decorators";

import {BooksService} from './books.service.js';
import { ZodValidationPipe} from "../pipes/zod.pipe";
import {booksSchema} from "./books.schema";
import {Roles, RolesGuard} from "../guards/roles.guard";
import {ParseIntPipe} from "../pipes/parse-int.pipe";

@Controller('/books')
@UseGuards(RolesGuard)
export class BooksController {
  constructor(private svc: BooksService) {}

  @Get('/')
  @Roles('admin')
  list() {
    return this.svc.findAll();
  }

  @Get('/:id')
  one(@Param('id', new ParseIntPipe()) id:number) {
    return this.svc.findOne(+id);
  }
  @Post('/')
  add(@Body(new ZodValidationPipe(booksSchema)) body: {success: boolean, data:{ title: string }}) {
    return this.svc.create(body.data.title);
  }
}
