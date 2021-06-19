import { Module } from '@nestjs/common';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
import configuration from './configuration';
import { ServeStaticModule } from '@nestjs/serve-static';
import { FileUploadModule } from '../../../libs/file-upload/src';
import { MainRequestModule } from './request/main.request.module';
import { DiscoveryService, EurekaModule } from 'nestjs-eureka';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TracingModule } from '@dollarsign/nestjs-jaeger-tracing/dist';

@Module({
  imports: [
    MainRequestModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../../', 'public/images'),
      serveRoot: '/files',
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    FileUploadModule,
    // TracingModule.forRoot({
    //   exporterConfig: {
    //     serviceName: 'core-service',
    //     // port: 16686, 9411
    //     port: 16686,
    //     host: 'localhost',
    //   },
    //   isSimpleSpanProcessor: true,
    // }),

    ClientsModule.register([
      {
        name: 'GATEWAY_SERVICE',
        transport: Transport.TCP,
        options: {
          ...TracingModule.getParserOptions(),
        },
      },
      {
        name: 'IMAGE_HANDLER_SERVICE',
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
  controllers: [],
  providers: [],
})
export class GatewayModule {
}
