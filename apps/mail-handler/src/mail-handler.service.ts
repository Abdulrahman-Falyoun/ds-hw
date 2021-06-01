import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer-core';
import { pathToUploadedFiles } from '../../../libs/file-upload/src/constants';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailHandlerService {
constructor(private configService: ConfigService) {
}
  private async _puppeteerPage(url: string): Promise<{ browser: puppeteer.Browser, page: puppeteer.Page }> {
    const browser = await puppeteer.launch({
      headless: true,
      executablePath: 'C:\\Users\\JS\\Downloads\\chrome-win\\chrome.exe',
    });
    const page = await browser.newPage();
    await page.goto(url, {
      timeout: 0,
      waitUntil: ['domcontentloaded', 'networkidle0'],
    });

    return { page, browser };
  }

  async makePDFAndSendToEmail({ website, to, text, subject }) {
  console.log({ website, to, text, subject });
    let browser: puppeteer.Browser;
    try {
      const pup = await this._puppeteerPage(website);
      browser = pup.browser;
      const page = pup.page;
      const c = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      const s = [...Array(5)].map(_ => c[~~(Math.random() * c.length)]).join('');
      const pdfName = s + '.pdf';
      const path = pathToUploadedFiles + '/PDFs/' + pdfName;
      const buff = await page.pdf({
        path, margin: { // Word's default A4 margins
          top: '2.54cm',
          bottom: '2.54cm',
          left: '2.54cm',
          right: '2.54cm',
        },
      });

      const mailOptions = {
        from: this.configService.get('GMAIL_ACCOUNT'), // Update from email
        to: to,
        subject: subject,
        text: text,
        attachments: [{
          filename: pdfName,
          content: buff,
        }],
      };
      const GMAIL_ACCOUNT = this.configService.get('GMAIL_ACCOUNT');
      const GMAIL_PASSWORD = this.configService.get('GMAIL_PASSWORD');


      const transporter = nodemailer.createTransport({
        service: 'gmail',
        type: 'SMTP',
        host: 'smtp.gmail.com',
        // port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
          user: GMAIL_ACCOUNT,
          pass: GMAIL_PASSWORD,
        },
        tls: {
          rejectUnauthorized: false,
        },
      } as nodemailer.TransportOptions);

      await transporter.sendMail(mailOptions)
        .then(res => {
          console.log(`email was sent: `, res);
        });
    } catch (err) {
      console.log(`❌ Error: ${err.message}`);
      return `Could not make pdf`;
    } finally {
      await browser.close();
      console.log(`\n🎉 PDF captured.`);
    }
  }

}
