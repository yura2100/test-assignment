type Provider =
  | 'firebase'
  | 'wallet'
  | 'system-wallet'
  | 'system-wallet-private-key';

export type Identity = {
  provider: Provider;
  providerId: string;
};

export type User = {
  id: string;
  identities: Identity[];
};
