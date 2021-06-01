
export interface EnvironmentVariables {
  GMAIL_ACCOUNT: string;
  GMAIL_PASSWORD: string;
}

export default (): EnvironmentVariables => ({
  GMAIL_ACCOUNT: process.env.GMAIL_ACCOUNT,
  GMAIL_PASSWORD: process.env.GMAIL_PASSWORD
});
