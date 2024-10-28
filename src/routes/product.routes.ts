import { FastifyInstance } from 'fastify'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

const prisma = new PrismaClient()

const productSchema = z.object({
  name: z.string(),
  price: z.string().transform(val => {
    const parsed = Number.parseFloat(val)
    if (Number.isNaN(parsed)) {
      throw new Error('Preço inválido')
    }
    return parsed
  }),
})
type Product = z.infer<typeof productSchema>

async function productRoutes(app: FastifyInstance) {
  // Create
  app.post('/', async (request, reply) => {
    const { name, price } = productSchema.parse(request.body)
    const product = await prisma.product.create({
      data: {
        name,
        price,
      },
    })
    reply.code(201).send(product)
  })

  // Read
  app.get('/', async (request, reply) => {
    const products = await prisma.product.findMany()
    reply.send(products)
  })

  app.get('/:id', async (request, reply) => {
    const { id } = request.params as { id: string }
    const product = await prisma.product.findUnique({
      where: { id: id },
    })
    if (product) {
      reply.send(product)
    } else {
      reply.code(404).send({ message: 'Produto não encontrado' })
    }
  })

  // Update
  app.put('/:id', async (request, reply) => {
    const { id } = request.params as { id: string }
    const { name, price } = productSchema.parse(request.body)
    const product = await prisma.product.update({
      where: { id: id },
      data: { name, price },
    })
    reply.send(product)
  })

  // Delete
  app.delete('/:id', async (request, reply) => {
    const { id } = request.params as { id: string }
    await prisma.product.delete({
      where: { id: id },
    })
    reply.code(204).send()
  })
}

export default productRoutes
