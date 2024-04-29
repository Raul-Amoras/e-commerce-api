import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { ConfigModule } from '@nestjs/config'
import { CreateAccountController } from './controllers/create-account.controller'
import { envSchema } from './infra/env/env'
import { AuthModule } from './auth/auth.module'
import { AuthenticateController } from './controllers/authenticate.controller'
import { CreateCommentController } from './controllers/create-comment.controller'
import { FindProductController } from './controllers/product/find-product.controller'
import { CreateProductController } from './controllers/product/create-product.controller'
import { CreateCategoryController } from './controllers/category/create-category.controller'
import { FindCategoryController } from './controllers/category/find-category.controller'
import { UploadProductController } from './controllers/product/upload-product.controller'
import { StorageModule } from './infra/storege/storage.module'
import { EnvModule } from './infra/env/env.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    AuthModule,
    StorageModule,
  ],
  controllers: [
    AuthenticateController,
    CreateAccountController,
    CreateProductController,
    UploadProductController,
    CreateCategoryController,
    CreateCommentController,
    FindProductController,
    FindCategoryController,
  ],
  providers: [PrismaService],
})
export class AppModule {}
