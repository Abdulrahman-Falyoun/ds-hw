import { Inject, Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer-core';
import { pathToUploadedFiles } from '../../../libs/file-upload/src/constants';
import axios from 'axios';
import {
  IMAGE_HANDLER_REDIS_PROXY_CLIENT,
  WEBSITE_HANDLER_REDIS_PROXY_CLIENT,
} from '../../gateway/src/ms-clients/redis-handler.client';
import { ClientProxy } from '@nestjs/microservices';
import { FILE_METADATA } from '../../patterns';
@Injectable()
export class WebsiteHandlerService {

  constructor(
    @Inject(WEBSITE_HANDLER_REDIS_PROXY_CLIENT) private websiteClient: ClientProxy,
    @Inject(IMAGE_HANDLER_REDIS_PROXY_CLIENT) private imageClient: ClientProxy,
    ) {
  }
  private async _puppeteerPage(
    url: string,
  ): Promise<{ browser: puppeteer.Browser; page: puppeteer.Page }> {
    const browser = await puppeteer.launch({
      headless: false,
      executablePath: 'C:\\Users\\JS\\Downloads\\chrome-win\\chrome.exe',
    });
    const page = await browser.newPage();
    await page.goto(url, {
      timeout: 0,
      waitUntil: ['domcontentloaded', 'networkidle0'],
    });

    return { page, browser };
  }

  async getScreenshotAndItsMetadata(url: string) {
    const { page, browser } = await this._puppeteerPage(url);
    const path = `./screenshots/file-${Date.now()}.png`;
    await page.screenshot({
      path,
      fullPage: true,
      type: 'png',
    });

    await browser.close();

    const metadata = await this.imageClient.send(FILE_METADATA, path).toPromise();
    // const response = await axios.post(
    //   'http://localhost:7345/api/file-metadata',
    //   {
    //     path,
    //   },
    // );
    return { path, metadata };
  }

  async makePDF(website: string) {
    // let browser: puppeteer.Browser;
    // try {
    //   const pup = await this._puppeteerPage(website);
    //   browser = pup.browser;
    //   const page = pup.page;
    //   const c = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    //   const s = [...Array(5)].map(_ => c[~~(Math.random() * c.length)]).join('');
    //
    //   const pdfName = s + '.pdf';
    //   const path = pathToUploadedFiles + '/PDFs/' + pdfName;
    //   await page.pdf({
    //     path,
    //   });
    // } catch (err) {
    //   console.log(`❌ Error: ${err.message}`);
    //   return `Could not make pdf`;
    // } finally {
    //   await browser.close();
    //   console.log(`\n🎉 PDF captured.`);
    // }
  }

  async takeScreenshot(website: string) {
    let browser: puppeteer.Browser;
    try {
      const pup = await this._puppeteerPage(website);
      browser = pup.browser;
      const page = pup.page;
      const c =
        'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      const s = [...Array(5)]
        .map((_) => c[~~(Math.random() * c.length)])
        .join('');

      const screenshotName = s + '.jpg';
      const path = pathToUploadedFiles + '/screenshots/' + screenshotName;
      await page.screenshot({
        path: path,
        type: 'jpeg',
        fullPage: true,
      });
      return {
        url: `screenshot url http://localhost:${process.env.GATEWAY_PORT}/files/screenshots/${screenshotName}`,
        path: path
      };
    } catch (err) {
      console.log(`❌ Error: ${err.message}`);
      return `Could not take screenshot`;
    } finally {
      await browser.close();
      console.log(`\n🎉 Screenshot captured.`);
    }
  }
}
