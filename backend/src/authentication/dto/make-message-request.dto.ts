import { IsEthereumAddress } from 'class-validator';

export class MakeMessageRequestDto {
  @IsEthereumAddress()
  address: string;
}
