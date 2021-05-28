import { BadRequestException, Injectable } from '@nestjs/common';
import { createThumbnail, getImageDimensions } from './helpers';
import { operationsCodes } from '../../utils/operation-codes';
import { InjectModel } from '@nestjs/mongoose';
import { LAMAR_FILE } from '../../../apps/schema-names';
import { Model } from 'mongoose';
import { File } from './file.model';
import * as path from 'path';

@Injectable()
export class FileUploadService {
  constructor(
    @InjectModel(LAMAR_FILE) private readonly fileModel: Model<File>,
  ) {}
  async saveFile(file: Express.Multer.File) {
    let createdFile;
    try {
      await createThumbnail(file, 200);
    } catch (e) {
      console.log('Resizing error: ', e.message || e);
      throw new BadRequestException({
        message: e.message || e,
        code: operationsCodes.UN_COMPLETE,
      });
    }
    const metadata = await getImageDimensions(file.path);
    createdFile = await this.fileModel.create({
      url: `http://localhost:7000/files/${file.filename}`,
      thumbnail: `http://localhost:7000/files/thumbnails/${file.filename}`,
      name: file.filename,
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      dest: file.destination,
      height: metadata.height,
      width: metadata.width,
      ext: path.extname(file.originalname),
    });
    return {
      file: createdFile,
      message: 'File saved successfully',
      code: operationsCodes.SUCCESS,
    };
  }
  async saveMultipleFiles(files: Express.Multer.File[]) {
    try {
      const res = [];
      for (const file of files) {
        const { file: createdFile } = await this.saveFile(file);
        res.push(createdFile);
      }
      return {
        files: res,
        message: 'File saved successfully',
        code: operationsCodes.SUCCESS,
      }
    } catch (e) {
      console.log({ e });
      throw new BadRequestException({
        message: e.message || e,
        code: operationsCodes.UN_COMPLETE,
      });
    }
  }
}