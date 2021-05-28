
export interface EnvironmentVariables {
  port: number;
}

export default (): EnvironmentVariables => ({
  port: +process.env.MAIN_PORT,
});
