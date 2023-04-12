import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { Web3AuthenticationModule } from '../web3-authentication/web3-authentication.module';
import { UsersRepository } from './users.repository';
import { FirebaseModule } from '../firebase/firebase.module';
import { WalletsModule } from '../wallets/wallets.module';
import { AuthenticationGuard } from './authentication.guard';

@Module({
  imports: [Web3AuthenticationModule, FirebaseModule, WalletsModule],
  providers: [AuthenticationService, UsersRepository, AuthenticationGuard],
  controllers: [AuthenticationController],
})
export class AuthenticationModule {}
