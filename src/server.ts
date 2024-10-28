import { PrismaClient } from '@prisma/client'
import fastify from 'fastify'
import productRoutes from './routes/product.routes'
//import { z } from 'zod'

const app = fastify()
const prisma = new PrismaClient()

app.register(productRoutes, { prefix: '/products' });

app
  .listen({
    host: '0.0.0.0',
    port: process.env.PORT ? Number(process.env.PORT) : 3333,
  })
  .then(() => {
    console.log('HTTP Server is running')
  })
