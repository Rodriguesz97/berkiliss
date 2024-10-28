import { PrismaClient } from '@prisma/client'
import fastify from 'fastify'
import productRoutes from './routes/product.routes'
import tableRoutes from './routes/table.routes'


const app = fastify()
const prisma = new PrismaClient()

app.register(productRoutes, { prefix: '/products' })
app.register(tableRoutes, { prefix: '/tables' })

app
  .listen({
    host: '0.0.0.0',
    port: process.env.PORT ? Number(process.env.PORT) : 3333,
  })
  .then(() => {
    console.log('HTTP Server is running')
  })
