import { Injectable } from '@nestjs/common';
import { cert, initializeApp } from 'firebase-admin/app';
import { Auth, getAuth } from 'firebase-admin/auth';
import { Identity } from '../authentication/types';

@Injectable()
export class FirebaseService {
  private readonly authentication: Auth;

  // TODO: Inject app
  constructor() {
    const app = initializeApp({
      credential: cert(process.env.FIREBASE_CERT),
    });
    this.authentication = getAuth(app);
  }

  async createIdentity(): Promise<Identity> {
    const { uid } = await this.authentication.createUser({});
    return { provider: 'firebase', providerId: uid };
  }

  createToken(uid: string): Promise<string> {
    return this.authentication.createCustomToken(uid);
  }

  async verifyToken(token: string): Promise<Identity> {
    const { uid } = await this.authentication.verifyIdToken(token);
    return { provider: 'firebase', providerId: uid };
  }
}
