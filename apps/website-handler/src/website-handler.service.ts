import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer-core';
import { pathToUploadedFiles } from '../../../libs/file-upload/src/constants';

@Injectable()
export class WebsiteHandlerService {

  private async _puppeteerPage(url: string): Promise<{ browser: puppeteer.Browser, page: puppeteer.Page }> {
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
      const c = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      const s = [...Array(5)].map(_ => c[~~(Math.random() * c.length)]).join('');

      const screenshotName = s + '.jpg';
      const path = pathToUploadedFiles + '/screenshots/' + screenshotName;
      await page.screenshot({
        path: path,
        type: 'jpeg',
        fullPage: true,
      });
      return `screenshot url http://localhost:${process.env.GATEWAY_PORT}/files/screenshots/${screenshotName}`;
    } catch (err) {
      console.log(`❌ Error: ${err.message}`);
      return `Could not take screenshot`;
    } finally {
      await browser.close();
      console.log(`\n🎉 Screenshot captured.`);
    }
  }
}
