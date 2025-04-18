import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { TransformInterceptor } from './transform.interceptor'
import { Logger } from '@nestjs/common'

async function bootstrap() {
  const logger = new Logger()
  const app = await NestFactory.create(AppModule)
  const port = 3000
  app.useGlobalInterceptors(new TransformInterceptor())
  await app.listen(port)
  logger.log(`Application listening on port ${port}`)
}
bootstrap()
