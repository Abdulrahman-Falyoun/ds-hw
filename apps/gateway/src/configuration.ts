
export interface EnvironmentVariables {
  port: number;
}

export default (): EnvironmentVariables => ({
  port: +process.env.GATEWAY_PORT,
});
