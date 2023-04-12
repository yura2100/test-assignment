import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import { Identity } from '../authentication/types';

@Injectable()
export class WalletsService {
  // TODO: Encrypt private key
  async createIdentities(): Promise<Identity[]> {
    const wallet = ethers.Wallet.createRandom();
    return [
      { provider: 'system-wallet', providerId: wallet.address },
      { provider: 'system-wallet-private-key', providerId: wallet.privateKey },
    ];
  }
}
