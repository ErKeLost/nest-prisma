import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export const GetUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request: Express.Request = ctx.switchToHttp().getRequest()
    // 装饰器 是否传递data 如果传递就返回相应的data
    if (data) {
      return request.user[data]
    }
    return request.user
  }
)
