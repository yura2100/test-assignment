import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AuthenticationService } from './authentication.service';
import { AuthenticationGuard } from './authentication.guard';
import { MakeMessageRequestDto } from './dto/make-message-request.dto';
import { SignInWithWalletRequestDto } from './dto/sign-in-with-wallet-request.dto';
import { LinkWalletRequestDto } from './dto/link-wallet-request.dto';

@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('make-message')
  async makeMessage(@Body() { address }: MakeMessageRequestDto) {
    const message = await this.authenticationService.makeMessage(address);
    return { message };
  }

  @Post('sign-in-with-wallet')
  async signInWithWallet(
    @Body() { message, signature }: SignInWithWalletRequestDto,
  ) {
    const token = await this.authenticationService.signInWithWallet(
      message,
      signature,
    );
    return { token };
  }

  // TODO: Extract userId to decorator
  @UseGuards(AuthenticationGuard)
  @Post('link-wallet')
  async linkWallet(
    @Res() response: Response,
    @Body() { message, signature }: LinkWalletRequestDto,
  ) {
    const { userId } = response.locals;
    await this.authenticationService.linkWallet(userId, message, signature);
  }
}
