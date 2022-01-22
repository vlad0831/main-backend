import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { UserPersonaInquiryModule } from '../user-persona-inquiry/userPersonaInquiry.module';
import { AuthModule } from '../auth/auth.module';
import { UserRequiredPersonaInquiry } from './entities/userRequiredPersonaInquiry.entity';
import { UserRequiredPersonaInquiryResolver } from './userRequiredPersonaInquiry.resolver';
import { UserRequiredPersonaInquiryService } from './userRequiredPersonaInquiry.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([UserRequiredPersonaInquiry]),
    AuthModule,
    UserPersonaInquiryModule,
  ],
  providers: [
    UserRequiredPersonaInquiryService,
    UserRequiredPersonaInquiryResolver,
  ],
  exports: [UserRequiredPersonaInquiryService],
})
export class UserRequiredPersonaInquiryModule {}
