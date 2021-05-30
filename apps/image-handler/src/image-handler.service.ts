import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { createThumbnail, getImageDimensions } from '../../../libs/file-upload/src/helpers';
import { extname } from 'path';
import { Model } from 'mongoose';
import { IFile } from '../../../libs/file-upload/src';
import { DS_FILE_SCHEMA } from '../../schema-names';
import { InjectModel } from '@nestjs/mongoose';
import * as puppeteer from 'puppeteer';
import * as fs from 'fs';
import { pathToUploadedFiles } from '../../../libs/file-upload/src/constants';

@Injectable()
export class ImageHandlerService {

  constructor(@InjectModel(DS_FILE_SCHEMA) private readonly fileModel: Model<IFile>) {
  }

  async takeScreenshot(website: string) {
    let browser: puppeteer.Browser;
    try {
      browser = await puppeteer.launch({
        headless: false,
      });
      const page = await browser.newPage();
      await page.goto(website, {
        timeout: 0,
        waitUntil: ['domcontentloaded', 'networkidle0'],
      });

      const path = pathToUploadedFiles + '/screenshots/' + (website.substr(website.indexOf("https://") + 8)) + "-" + (new Date().toISOString());
      await page.screenshot({
        path,
        type: 'jpeg',
        fullPage: true,
      });
      return `screenshot url http://localhost:${process.env.PORT}/${path}`;
    } catch (err) {
      console.log(`❌ Error: ${err.message}`);
      return `Could not take screenshot`
    } finally {
      await browser.close();
      console.log(`\n🎉 GitHub profile screenshots captured.`);
    }
  }


  largestFile(files: Express.Multer.File []) {
    const sortedFiles = files.sort((f1, f2) => f1.size - f2.size);
    return sortedFiles[sortedFiles.length - 1];
  }


  async resizeImage({ image, opts }: { image: Express.Multer.File; opts: { width: number, height: number } }) {
    try {
      await createThumbnail(image, +opts.width);
      const metadata = await getImageDimensions(image.path);
      const createdFile = await this.fileModel.create({
        url: `http://localhost:${process.env.GATEWAY_PORT}/files/${image.filename}`,
        thumbnail: `http://localhost:${process.env.GATEWAY_PORT}/files/thumbnails/${image.filename}`,
        name: image.filename,
        originalName: image.originalname,
        mimetype: image.mimetype,
        size: image.size,
        dest: image.destination,
        height: metadata.height,
        width: metadata.width,
        ext: extname(image.originalname),
      });
      return {
        file: createdFile,
        message: 'File saved successfully',
      };
    } catch (e) {
      console.log('Resizing error: ', e.message || e);
      throw new BadRequestException({
        message: e.message || e,
      });
    }

  }
}
