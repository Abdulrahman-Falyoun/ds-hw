import {
  Body,
  Controller,
  Inject,
  Logger,
  NotFoundException,
  Post,
  Query,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { MainEmitter } from '../emitters/main.emitter';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { pathToUploadedFiles } from '../../../../libs/file-upload/src/constants';
import {
  editFileName,
  imageFileFilter,
} from '../../../../libs/file-upload/src/helpers';
import { gatewayEureka } from '../main';
import { IMAGE_HANDLER_ID } from '../../../ids';
import * as fs from 'fs';
export type healthType = {
  deadlocks: {
    healthy: boolean;
  };
  Disk: {
    healthy: boolean;
  };
  Memory: {
    healthy: boolean;
  };
};
@Controller('/api')
export class MainRequest {
  private readonly logger = new Logger(MainRequest.name);

  constructor(
    private mainEmitter: MainEmitter, // private discoveryService: DiscoveryService
  ) {
    // console.log(discoveryService);
    // discoveryService.resolveHostname('jqservice')
  }

  private _isServiceOn(serviceId: string): boolean {
    return (
      gatewayEureka.getInstancesByVipAddress('ds.ite').filter((s) => {
        console.log('s.instanceId: ', s.instanceId);
        console.log('service id: ', serviceId);
        return s.instanceId === serviceId;
      }).length > 0
    );
  }

  @Post('/health')
  checkHealth(): healthType {
    const healthObject = fs.readFileSync('health.json', {
      encoding: 'utf-8',
    });
    return JSON.parse(healthObject) as healthType;
  }
  @Post('/screenshot')
  takeScreenshot(@Body() data: { website: string }) {
    const { website } = data;
    this.logger.log(`Requested screenshot for: ${website}`);

    return this.mainEmitter.emitTakeScreenshot(website);
  }
  @Post('/screenshot-with-metadata')
  takeScreenshotAndItsMetadata(@Body() data: { website: string }) {
    const { website } = data;
    this.logger.log(`Requested screenshot for: ${website}`);
    return this.mainEmitter.emitTakeScreenshotAndGetMetadata(website);
  }

  @Post('/file-metadata')
  getMetadata(@Body() data: { path: string }) {
    console.log({ data });
    return this.mainEmitter.emitGetMetadata(data.path);
  }

  @Post('/largest-file')
  @UseInterceptors(
    FilesInterceptor('images[]', 20, {
      storage: diskStorage({
        destination: pathToUploadedFiles,
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  largestFile(@UploadedFiles() files: Express.Multer.File[]) {
    console.log('emitting largest files');
    if (this._isServiceOn(IMAGE_HANDLER_ID)) {
      return this.mainEmitter.emitLargestFile(files);
    } else {
      const healthObject: healthType = {
        deadlocks: {
          healthy: false,
        },
        Disk: {
          healthy: false,
        },
        Memory: {
          healthy: false,
        },
      };
      fs.writeFileSync('health.json', JSON.stringify(healthObject), {
        encoding: 'utf-8',
      });
      return healthObject;
    }
    // throw new NotFoundException({
    //   message: 'service is off',
    // });
  }

  @Post('/pdf/send-email')
  sendEmail(
    @Body()
    data: {
      to: string;
      text: string;
      subject: string;
      website: string;
    },
  ) {
    return this.mainEmitter.emitMakePDF(data);
  }

  @Post('/resize')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: pathToUploadedFiles,
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  resize(
    @UploadedFile() image: Express.Multer.File,
    @Query() opts: { width: number; height: number },
  ) {
    return this.mainEmitter.emitResizeImage({ image, opts });
  }

  @Post('/screenshot/then/metadata')
  async getScreenshotThenMetadata(@Body() { website }: { website: string }) {
    const { url, path } = await this.mainEmitter.emitTakeScreenshot(website);
    // const metadata = await axios
    //   .post('http://localhost:7345/api/file-metadata', { path })
    //   .then((r) => r.data);
    const metadata = await this.mainEmitter.emitGetMetadata(path);
    return {
      url,
      path,
      metadata,
    };
  }

  @Post('/screenshot/concurrently/metadata')
  async getScreenshotConcurrentlyMetadata(
    @Body() { website, path }: { website: string; path: string },
  ) {
    const pScreenshot = this.mainEmitter.emitTakeScreenshot(website);
    const pMetadata = this.mainEmitter.emitGetMetadata(path);
    return await Promise.all([pMetadata, pScreenshot]).then((res) => res);
  }
}
