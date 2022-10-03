import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { COSActions, generatePath } from './cos'
// import { FileDto } from './dto/imgUpload.dto'
@Injectable()
export class CosService {
  private readonly cos: COSActions
  constructor(private readonly configService: ConfigService) {
    this.cos = new COSActions(
      {
        SecretId: process.env.SecretId,
        SecretKey: process.env.SecretKey
      },
      'https://erkelost-1304176814.cos.ap-beijing.myqcloud.com/'
    )
  }

  public async uploadImage(img: any, fileBuffer: any) {
    const fullPath = generatePath(img.originalFilename)
    const [error, imgPath] = await this.cos.uploadImg(fullPath, fileBuffer)
    if (error) {
      throw error
    }
    return {
      path: `https://${imgPath}`
    }
  }
}
