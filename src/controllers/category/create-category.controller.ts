import {
  BadRequestException,
  ConflictException,
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { FileInterceptor } from '@nestjs/platform-express'
import { Uploader } from '../../domain/e-commerce/application/interface/storege/uploader'
import { z } from 'zod'

const createCategorySchema = z.object({
  name: z.string().min(1),
})

type CreateCategorySchema = z.infer<typeof createCategorySchema>
@Controller('/category')
export class CreateCategoryController {
  @Post('create')
  @UseInterceptors(FileInterceptor('file'))
  async hadle(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 1024 * 1024 * 10, // 10mb
          }),
          new FileTypeValidator({ fileType: '.(png|jpg|jpeg|svg)' }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Query() query: CreateCategorySchema,
  ) {
    const { name } = query

    if (!name) {
      throw new BadRequestException('Nome da categoria deve ser fornecido')
    }

    const category = await this.prisma.category.findUnique({
      where: {
        name,
      },
    })

    if (category) {
      throw new ConflictException('Essa categoria já existe')
    }

    const { url } = await this.uploader.upload({
      fileName: file.originalname,
      fileType: file.mimetype,
      body: file.buffer,
    })

    await this.prisma.category.create({
      data: {
        name,
        url,
      },
    })
  }

  constructor(
    private readonly prisma: PrismaService,
    private readonly uploader: Uploader,
  ) {}
}
