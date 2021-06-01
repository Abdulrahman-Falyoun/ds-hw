import { ClientProxyFactory, Transport } from "@nestjs/microservices";

export const RABBIT_HANDLER_REDIS_PROXY_CLIENT = "RABBIT_HANDLER_REDIS_PROXY_CLIENT";
export const RabbitHandlerClient = ClientProxyFactory.create({
  transport: Transport.RMQ,
  options: {
    urls: ['amqp://localhost:5672'],
    queue: 'mail_queue',
    queueOptions: {
      durable: false
    },
  },
},);
