import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { UserPersonaInquiry } from './entities/userPersonaInquiry.entity';
import { UserPersonaInquiryService } from './userPersonaInquiry.service';

@Module({
  imports: [MikroOrmModule.forFeature([UserPersonaInquiry])],
  providers: [UserPersonaInquiryService],
  exports: [UserPersonaInquiryService],
})
export class UserPersonaInquiryModule {}
