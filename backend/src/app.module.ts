import { Module } from '@nestjs/common';
import { AuthenticationModule } from './authentication/authentication.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [DatabaseModule, AuthenticationModule],
})
export class AppModule {}
