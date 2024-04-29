import { PrismaService } from '../../prisma/prisma.service'
import {
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  NotFoundException,
  ParseFilePipe,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { Uploader } from '../../domain/e-commerce/application/interface/storege/uploader'
import { z } from 'zod'
import { FileInterceptor } from '@nestjs/platform-express'
const productBodySchema = z.object({
  productId: z.string(),
})

type ProductBodySchema = z.infer<typeof productBodySchema>
@Controller('/products')
export class UploadProductController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly uploader: Uploader,
  ) {}

  @Post('upload/image')
  @UseInterceptors(FileInterceptor('file'))
  async hadle(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 1024 * 1024 * 16, // 10mb
          }),
          new FileTypeValidator({ fileType: '.(png|jpg|jpeg|svg)' }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Query() query: ProductBodySchema,
  ) {
    const { productId } = query

    if (!productId) {
      throw new NotFoundException('ID do Produto obrigatorio.')
    }

    const product = this.prisma.product.findUnique({
      where: {
        id: productId,
      },
    })

    if (!product) {
      throw new NotFoundException('Produto não localizado.')
    }

    const { url } = await this.uploader.upload({
      fileName: file.originalname,
      fileType: file.mimetype,
      body: file.buffer,
    })
    await this.prisma.productImage.create({
      data: {
        url,
        product: {
          connect: {
            id: productId,
          },
        },
      },
    })
  }
}
