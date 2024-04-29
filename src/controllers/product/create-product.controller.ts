import { PrismaService } from '../../prisma/prisma.service'
import { Body, Controller, NotFoundException, Post } from '@nestjs/common'
import { z } from 'zod'

const createProductBodySchema = z.object({
  name: z.string(),
  description: z.string(),
  shortDescription: z.string(),
  priceString: z.string(),
  categoryId: z.string().uuid(),
  sku: z.string(),
})

type CreateProductBodySchema = z.infer<typeof createProductBodySchema>

@Controller('/products')
export class CreateProductController {
  constructor(private readonly prisma: PrismaService) {}

  @Post('create')
  async hadle(@Body() body: CreateProductBodySchema) {
    const {
      name,
      description,
      shortDescription,
      priceString,
      categoryId,
      sku,
    } = body
    const price = parseFloat(priceString.replace(/\./g, '').replace(',', '.'))
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
    })

    if (!category) {
      throw new NotFoundException('Categooria não encontrada.')
    }

    await this.prisma.product.create({
      data: {
        name,
        description,
        shortDescription,
        price,
        sku,
        category: {
          connect: {
            id: categoryId,
          },
        },
      },
    })
  }
}
