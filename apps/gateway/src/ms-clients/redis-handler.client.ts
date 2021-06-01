import { ClientProxyFactory, Transport } from "@nestjs/microservices";

export const IMAGE_HANDLER_REDIS_PROXY_CLIENT = "IMAGE_HANDLER_REDIS_PROXY_CLIENT";
export const RedisHandlerClient = ClientProxyFactory.create({
  transport: Transport.REDIS,
  options: {
    auth_pass: process.env.REDIS_PASSWORD,
    url: process.env.REDIS_URL
  }
});
