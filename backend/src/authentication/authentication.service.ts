import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Web3AuthenticationService } from '../web3-authentication/web3-authentication.service';
import { UsersRepository } from './users.repository';
import { FirebaseService } from '../firebase/firebase.service';
import { WalletsService } from '../wallets/wallets.service';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly web3AuthenticationService: Web3AuthenticationService,
    private readonly usersRepository: UsersRepository,
    private readonly firebaseService: FirebaseService,
    private readonly walletService: WalletsService,
  ) {}

  async makeMessage(address: string): Promise<string> {
    return this.web3AuthenticationService.makeMessage(address);
  }

  async signInWithWallet(message: string, signature: string): Promise<string> {
    const address = await this.web3AuthenticationService.verifyMessage(
      message,
      signature,
    );

    if (!address) {
      throw new UnauthorizedException("Couldn't verify message");
    }

    const user = await this.usersRepository.getByIdentities(
      { provider: 'wallet', providerId: address },
      { provider: 'system-wallet', providerId: address },
    );
    let firebaseIdentity = user.identities.find(
      ({ provider }) => provider === 'firebase',
    );

    if (!firebaseIdentity) {
      firebaseIdentity = await this.firebaseService.createIdentity();
      user.identities.push(firebaseIdentity);
      user.identities.push({ provider: 'wallet', providerId: address });
    }

    await this.usersRepository.save(user);
    return this.firebaseService.createToken(firebaseIdentity.providerId);
  }

  async linkWallet(
    userId: string,
    message: string,
    signature: string,
  ): Promise<void> {
    const address = await this.web3AuthenticationService.verifyMessage(
      message,
      signature,
    );

    if (!address) {
      throw new UnauthorizedException("Couldn't verify message");
    }

    const { identities } = await this.usersRepository.getByIdentities(
      { provider: 'wallet', providerId: address },
      { provider: 'system-wallet', providerId: address },
    );

    if (identities.length > 0) {
      throw new ForbiddenException('Wallet is already linked to an account');
    }

    const user = await this.usersRepository.getById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.identities.push({ provider: 'wallet', providerId: address });
    await this.usersRepository.save(user);
  }

  async verifyAndSync(token: string): Promise<string> {
    const identity = await this.firebaseService.verifyToken(token);
    const user = await this.usersRepository.getByIdentities(identity);

    if (user.identities.length === 0) {
      user.identities.push(identity);
    }

    const systemWalletIdentity = user.identities.find(
      ({ provider }) => provider === 'system-wallet',
    );

    if (!systemWalletIdentity) {
      const identities = await this.walletService.createIdentities();
      user.identities.push(...identities);
    }

    await this.usersRepository.save(user);
    return user.id;
  }
}
