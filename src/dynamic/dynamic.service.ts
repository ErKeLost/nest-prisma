import { Injectable } from '@nestjs/common'
import { formidable } from 'formidable'
@Injectable()
export class DynamicService {
  async release(createDynamicDto) {
    const form = formidable({})
    const res = await new Promise((resolve, reject) => {
      form.parse(createDynamicDto, (err, fields, files) => {
        if (err) {
          reject(err)
        }
        resolve({ fields, files })
      })
    })
    const userId = createDynamicDto.user.id
    console.log(userId)

    console.log(res)
    return res
  }
}
