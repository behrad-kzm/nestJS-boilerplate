import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { AuthService } from '../../../v1/auth/auth.service';

@Injectable()
export class ExampleSeedService {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
  ) {}

  async run(){
    // seed example here
  }
}
