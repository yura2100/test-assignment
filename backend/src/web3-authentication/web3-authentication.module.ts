import { Module } from '@nestjs/common';
import { Web3AuthenticationService } from './web3-authentication.service';

@Module({
  providers: [Web3AuthenticationService],
  exports: [Web3AuthenticationService],
})
export class Web3AuthenticationModule {}
