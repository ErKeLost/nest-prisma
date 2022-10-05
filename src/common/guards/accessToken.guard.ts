import { ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class JwtAccessTokenGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super()
  }

  //   canActivate(context: ExecutionContext): any {
  //     const isPublic = this.reflector.getAllAndOverride('isPublic', [
  //       context.getHandler(),
  //       context.getClass()
  //     ])
  //     if (isPublic) return true
  //     return super.canActivate(context)
  //   }
}
