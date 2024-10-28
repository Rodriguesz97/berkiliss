import { FastifyInstance } from 'fastify'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

const prisma = new PrismaClient()

const tableSchema = z.object({
  name: z.string(),
})

async function tableRoutes(app: FastifyInstance) {
  // Create
  app.post('/', async (request, reply) => {
    const { name } = tableSchema.parse(request.body)
    const table = await prisma.table.create({
      data: {
        name,
      },
    })
    reply.code(201).send(table)
  })

  // Read
  app.get('/', async (request, reply) => {
    const tables = await prisma.table.findMany()
    reply.send(tables)
  })

  app.get('/:id', async (request, reply) => {
    const { id } = request.params as { id: string }
    const table = await prisma.table.findUnique({
      where: { id: id },
    })
    if (table) {
      reply.send(table)
    } else {
      reply.code(404).send({ message: 'Mesa não encontrada' })
    }
  })

  // Update
  app.put('/:id', async (request, reply) => {
    const { id } = request.params as { id: string }
    const { name } = tableSchema.parse(request.body)
    const table = await prisma.table.update({
      where: { id: id },
      data: { name },
    })
    reply.send(table)
  })

  // Delete
  app.delete('/:id', async (request, reply) => {
    const { id } = request.params as { id: string }
    await prisma.table.delete({
      where: { id: id },
    })
    reply.code(204).send()
  })
}

export default tableRoutes
