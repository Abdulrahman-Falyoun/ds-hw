import axios from 'axios';
import { Test, TestingModule } from '@nestjs/testing';
import { MainRequest } from '../gateway/src/request/main.request';
import { MainEmitter } from '../gateway/src/emitters/main.emitter';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
import configuration from '../gateway/src/configuration';
import { FileUploadModule } from '../../libs/file-upload/src';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TracingModule } from '@dollarsign/nestjs-jaeger-tracing/dist';
import {
  IMAGE_HANDLER_REDIS_PROXY_CLIENT,
  WEBSITE_HANDLER_REDIS_PROXY_CLIENT,
} from '../gateway/src/ms-clients/redis-handler.client';
import {
  RABBIT_HANDLER_REDIS_PROXY_CLIENT,
  RabbitHandlerClient,
} from '../gateway/src/ms-clients/rabbit-handler.client';

const api = 'http://localhost:7345/api';
describe('Distributed Tracing', () => {
  let mainRequest: MainRequest;
  let spyService: MainEmitter;
  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [configuration],
        }),
        ServeStaticModule.forRoot({
          rootPath: join(__dirname, '../../../', 'public/images'),
          serveRoot: '/files',
        }),
        FileUploadModule,
        ClientsModule.register([
          {
            name: 'GATEWAY_SERVICE',
            transport: Transport.TCP,
            options: {
              ...TracingModule.getParserOptions(),
            },
          },
          {
            name: IMAGE_HANDLER_REDIS_PROXY_CLIENT,
            transport: Transport.REDIS,
            options: {
              ...TracingModule.getParserOptions(),
            },
          },
          {
            name: WEBSITE_HANDLER_REDIS_PROXY_CLIENT,
            transport: Transport.REDIS,
            options: {
              ...TracingModule.getParserOptions(),
            },
          },
        ]),
        TracingModule.forRootAsync({
          useFactory: () => ({
            exporterConfig: {
              serviceName: 'gateway-service',
            },
            isSimpleSpanProcessor: true,
          }),
        }),
      ],
      // controllers: [MainRequest],
      providers: [
        {
          provide: RABBIT_HANDLER_REDIS_PROXY_CLIENT,
          useValue: RabbitHandlerClient,
        },
        MainEmitter,
      ],
    }).compile();

    // appController = app.get<AppController>(AppController);
    spyService = app.get<MainEmitter>(MainEmitter);

    jest.setTimeout(20000);
  });
  it('First we call the service A, then await for response, once response resolved, A calls C and wait for response :: using axios', async () => {
    const response = await axios.post(`${api}/screenshot/then/metadata`, {
      website: 'https://google.com',
    });
    const { url, path, metadata } = response.data;
    expect(metadata).toBeDefined();
    expect(url).toBeDefined();
    expect(path).toBeDefined();
  });

  it('First we call the service A, A calls B, then B calls C and wait for response :: using axios', async () => {
    const response = await axios.post(`${api}/screenshot-with-metadata`, {
      website: 'https://google.com',
    });
    console.log({ data: response.data });
    const { path, metadata } = response.data;
    expect(metadata).toBeDefined();
    expect(path).toBeDefined();
  });

  it('First we call the service A, A calls B, A does not wait and immediately calls C:: using axios', async () => {
    const response = await axios.post(
      `${api}/screenshot/concurrently/metadata`,
      {
        website: 'https://google.com',
        path: './screenshots/file-1624301004426.png',
      },
    );
    console.log({ data: response.data });
    const res = response.data;
    expect(res).toBeDefined();
    const [metadata, obj] = res;
    expect(metadata).toBeDefined();
    expect(obj).toBeDefined();
  });

  it(`First we call the service A, then await for response, once response resolved, A calls C and wait for response :: using emitter`, async () => {
    const website = 'https://google.com';
    const r1 = await spyService.emitTakeScreenshot(website);
    const r2 = await spyService.emitGetMetadata(r1.path);
    expect(r1).toBeDefined();
    expect(r2).toBeDefined();
  });

  it(`First we call the service A, A calls B, then B calls C and wait for response :: using emitter`, async () => {
    const website = 'https://google.com';
    const r1 = await spyService.emitTakeScreenshotAndGetMetadata(website);
    expect(r1.path).toBeDefined();
    expect(r1.metadata).toBeDefined();
  });

  it(`First we call the service A, A calls B & C concurrently and wait for response :: using emitter`, async () => {
    const website = 'https://google.com';
    const path = './screenshots/file-1624301004426.png';
    const pScreenshot = spyService.emitTakeScreenshot(website);
    const pMetadata = spyService.emitGetMetadata(path);
    const res = await Promise.all([pMetadata, pScreenshot]);
    const [metadata, obj] = res;
    expect(metadata).toBeDefined();
    expect(obj).toBeDefined();
  });
});
