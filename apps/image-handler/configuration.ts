
export interface EnvironmentVariables {
  port: number;
  redis: {
    url: string;
    password: string;
  }
  db: {
    url: string;
    replicaSet: string;
  }
}

export default () :  EnvironmentVariables => ({
  port: +process.env.IMAGE_HANDLER_PORT,
  redis: {
    url : process.env.REDIS_URL,
    password: process.env.REDIS_PASSWORD,
  },
  db: {
    url: process.env.DATABASE_URL,
    replicaSet: process.env.REPLICA_SET,
  }
})