import { Injectable, OnModuleInit } from '@nestjs/common';
import moralis from 'moralis';
import { RequestMessageEvmOptions } from '@moralisweb3/auth';

// TODO: Use ConfigService
const config: Omit<RequestMessageEvmOptions, 'address'> = {
  networkType: 'evm',
  chain: process.env.CHAIN,
  domain: process.env.DOMAIN,
  uri: process.env.URI,
  timeout: Number(process.env.MORALIS_TIMEOUT),
};

@Injectable()
export class Web3AuthenticationService implements OnModuleInit {
  async onModuleInit(): Promise<void> {
    await moralis.start({ apiKey: process.env.MORALIS_API_KEY });
  }

  async makeMessage(address: string): Promise<string> {
    const { raw } = await moralis.Auth.requestMessage({
      ...config,
      address,
    });
    return raw.message;
  }

  async verifyMessage(
    message: string,
    signature: string,
  ): Promise<string | null> {
    try {
      const { raw } = await moralis.Auth.verify({
        ...config,
        message,
        signature,
      });
      return raw.address;
    } catch (e) {
      // TODO: Add proper error handling
      return null;
    }
  }
}
