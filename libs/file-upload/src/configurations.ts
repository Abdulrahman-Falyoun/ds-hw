
export interface EnvironmentVariables {
  port: number;
  redis: RedisConfig;
  db: DBConfig;
}

export interface RedisConfig  {
  url: string;
  password: string;
}

export interface DBConfig {
  url: string;
  replicaSet: string;
}

export default () :  EnvironmentVariables => ({
  port: +process.env.ECOMMERCE_PORT,
  redis: {
    url : process.env.REDIS_URL,
    password: process.env.REDIS_PASSWORD,
  },
  db: {
    url: process.env.DATABASE_URL,
    replicaSet: process.env.REPLICA_SET,
  }
})