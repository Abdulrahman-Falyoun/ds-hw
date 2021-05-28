import { Module } from "@nestjs/common";
import { DatabaseService } from "./database.service";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigService } from "@nestjs/config";

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        const dbConfig = configService.get("db");
        return {
          uri: dbConfig.url,
          replicaSet: dbConfig.replicaSet,
          useNewUrlParser: true
        };
      },
      inject: [ConfigService]
    })
  ],
  providers: [DatabaseService],
  exports: [DatabaseService]
})
export class DatabaseModule {
}
