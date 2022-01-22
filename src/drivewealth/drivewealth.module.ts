import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { DriveWealthService } from './drivewealth.service';

@Module({
  imports: [HttpModule],
  providers: [DriveWealthService],
  exports: [DriveWealthService],
})
export class DrivewealthModule {}
