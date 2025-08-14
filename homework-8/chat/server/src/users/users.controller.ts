import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
  NotFoundException
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import {UserDTO} from "../dto";
import {Store} from "../store/store";
import { v4 as uuidv4 } from 'uuid';
import * as path from "path";
import * as fs from "fs";

@Controller('/api/users')
export class UsersController {
  constructor(private store: Store) {}
  @Post()
  @UseInterceptors(FileInterceptor('icon'))
  createUser(
    @Body('name') name: string,
    @UploadedFile() icon?: Express.Multer.File,
  ): UserDTO {
    const id = uuidv4();
    const fileName = `${name}.png`;
    const iconDir = path.join(__dirname, '..', '..', 'public', 'icons');
    const filePath = path.join(iconDir, fileName);

    if (icon && icon.mimetype.match(/^image\/(png|jpeg)$/)) {
      fs.mkdirSync(iconDir, { recursive: true });
      fs.writeFileSync(filePath, icon.buffer);
    }

    const user:UserDTO = {
      id, name, iconUrl: `/api/users/${id}/icon`,
    }
    this.store.addUser(user);
    return user;
  }

  @Get()
  list(): { items: UserDTO[]; total: number } {
    const users = this.store.getUsers();
    return {items: users, total: users.length}
  }

  @Get(':id/icon')
  getUserIcon(@Param('id') id: string, @Res() res: Response) {
    const user = this.store.getUserById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const fileName = `${user.name}.png`;
    const iconPath = path.join(__dirname, '..', '..', 'public', 'icons', fileName);
    const defaultIconPath = path.join(__dirname, '..', '..', 'public', 'icons', 'default.png');

    if (!fs.existsSync(iconPath)) {
      return res.type('image/png').sendFile(defaultIconPath);
    }

    return res.type('image/png').sendFile(iconPath);
  }


  @Get('icons/:iconPath')
  async icon(@Param('iconPath') iconPath: string, @Res() res: Response) {
    const filePath = path.join(__dirname, '..', '..', 'public', 'icons', iconPath);

    if (!fs.existsSync(filePath)) {
      return res.status(404).send('Icon not found');
    }

    return res.type('image/png').sendFile(filePath);
  }
}
