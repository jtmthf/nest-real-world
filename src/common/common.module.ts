import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DrizzleService } from './drizzle.service';
import { IdService } from './id.service';

@Module({
  imports: [ConfigModule],
  providers: [DrizzleService, IdService],
  exports: [DrizzleService, IdService],
})
@Global()
export class CommonModule {}
