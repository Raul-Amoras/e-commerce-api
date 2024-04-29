import { Controller, Get } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'

@Controller('/category')
export class FindCategoryController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async hadle() {
    const category = await this.prisma.category.findMany()

    return category
  }
}
