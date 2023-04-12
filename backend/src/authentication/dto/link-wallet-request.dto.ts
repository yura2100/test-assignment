import { IsString } from 'class-validator';

// TODO: Add hash validation for message and signature
export class LinkWalletRequestDto {
  @IsString()
  message: string;
  @IsString()
  signature: string;
}
