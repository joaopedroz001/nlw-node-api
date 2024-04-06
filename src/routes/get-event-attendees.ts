import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../lib/prisma";
import { z } from "zod";

export async function getEventAttendees(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .get('/events/:eventId/attendees', {
      schema: {
        summary: 'Get event attendees',
        tags: ['events'],
        params: z.object({
          eventId: z.string().uuid(),
        }),
        querystring: z.object({
          query: z.string().nullish(),
          pageIndex: z.string().nullish().default('0').transform(Number)
        }),
        response: {
          200: z.object({
          attendees: z.array(
              z.object({
                id: z.number().int(),
            name: z.string(),
              email: z.string().email(),
                createdAt: z.date(),
                checkedInAt: z.date().nullable()
              })
            )
          })
        },
      }
      }, async (request, reply) => {
        const { eventId } = request.params

        const { pageIndex, query } = request.query

        const attendees = await prisma.attendee.findMany({
          select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
            checkIn: {
              select: {
                createdAt: true,
              }
            }
          },
          where: query ? {
            eventId,
            name: {
              contains: query,
            }
          } : {
            eventId,
          },
          take: 10,
          skip: pageIndex * 10,
          orderBy: {
            createdAt: "desc"
          }
        })

        return reply.send({
          attendees: attendees.map(attende => {
            return {
              id: attende.id,
              name: attende.name,
              email: attende.email,
              createdAt: attende.createdAt,
              checkedInAt: attende.checkIn?.createdAt ?? null,
            }
          }),
        })
    })
}