import { FastifyInstance } from 'fastify'
import { BadRequest } from './routes/_errors/bad-request'
import { ZodError } from 'zod'

type FastifyErrorHandler = FastifyInstance['errorHandler']

export const errorHandler: FastifyErrorHandler = (error, request, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      menssage: 'Error during validation.',
      erros: error.flatten().fieldErrors,
    })
  }

  if (error instanceof BadRequest) {
    return reply.status(400).send({ menssage: error.message })
  }

  return reply.status(500).send({mensage: 'Internal Server Error.'})
}