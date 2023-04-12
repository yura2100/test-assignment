export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;
      CHAIN: string;
      DOMAIN: string;
      URI: string;
      MORALIS_API_KEY: string;
      MORALIS_TIMEOUT: string;
      FIREBASE_CERT: string;
    }
  }
}
