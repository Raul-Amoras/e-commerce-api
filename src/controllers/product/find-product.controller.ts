import { PrismaService } from '../../prisma/prisma.service'
import { Controller, Get, Param, Query } from '@nestjs/common'
import { z } from 'zod'

const findParamsProductSchema = z.object({
  id: z.string().min(1),
})

type FindParamsProductSchema = z.infer<typeof findParamsProductSchema>
const Order = z.enum(['Crescente', 'Descrescente'])

const findAllParamsProductSchema = z.object({
  page: z.number(),
  limit: z.number(),
  categoryId: z.string(),
  order: Order.optional().default('Descrescente'),
})

const OrderBySchema = z.array(
  z.object({
    crescente: z.literal('asc'),
    descrescente: z.literal('desc'),
  }),
)

type orderBySchema = z.infer<typeof OrderBySchema>

type FindAllParamsProductSchema = z.infer<typeof findAllParamsProductSchema>
@Controller('/products')
export class FindProductController {
  constructor(private readonly prisma: PrismaService) {}
  @Get('all')
  async hadle(@Query() query: FindAllParamsProductSchema) {
    const { page, limit, categoryId, order } = query

    const orderBy: orderBySchema = [
      {
        crescente: 'asc',
        descrescente: 'desc',
      },
    ]

    const pageNumber = +page || 1
    const pageLimit = +limit || 16
    const skip = (pageNumber - 1) * pageLimit

    const filters = categoryId ? { categoryId } : {}

    const products = await this.prisma.product.findMany({
      where: filters,
      skip,
      take: pageLimit,
      orderBy: {
        name: orderBy[0][order],
      },
      include: {
        images: true,
        category: true,
      },
    })

    const totalProducts = await this.prisma.product.count({ where: filters })

    return {
      data: products,
      total: totalProducts,
      page: pageNumber,
      limit: pageLimit,
      totalPages: Math.ceil(totalProducts / pageLimit),
    }
  }

  @Get(':id')
  async findOne(@Param() params: FindParamsProductSchema) {
    const product = await this.prisma.product.findUnique({
      include: {
        images: true,
        category: true,
      },
      where: {
        id: params.id,
      },
    })
    return {
      product,
    }
  }

  @Get('category/:id')
  async findProductsByCategories(@Param() params: FindParamsProductSchema) {
    const product = await this.prisma.product.findMany({
      include: {
        images: true,
        category: true,
      },
      where: {
        categoryId: params.id,
      },
    })
    return {
      product,
    }
  }
}
