import * as sharp from 'sharp';
import { pathToUploadedFiles } from '../constants';

export const createThumbnail = (file: Express.Multer.File, width = 200) => {
  return sharp(file.path)
    .resize({
      width,
    })
    .toFile(`${pathToUploadedFiles}/thumbnails/${file.filename}`);
};
