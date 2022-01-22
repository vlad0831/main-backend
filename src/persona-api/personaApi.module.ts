import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PersonaApiService } from './personaApi.service';
import { PersonaApiHttpConfigService } from './personaApiHttpConfig.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      useClass: PersonaApiHttpConfigService,
    }),
  ],
  providers: [PersonaApiService],
  exports: [PersonaApiService],
})
export class PersonaApiModule {}
