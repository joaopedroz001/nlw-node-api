import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../lib/prisma";
import { z } from "zod";
import { BadRequest } from "./_errors/bad-request";

export async function registerForEvenet(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.post('/events/:eventId/attendees', {
			schema: {
				summary: 'Register an attendee',
        tags: ['attendees'],
				body: z.object({
					name: z.string().min(4),
					email: z.string().email(),
				}),
				params: z.object({
					eventId: z.string().uuid(),
				}),
				response: {
					201: z.object({
						attendeeId: z.number(),
					})
				}
			}
		}, async (request, reply) => {
			const { eventId } = request.params
			const { name, email } = request.body

			const attendeeFromEmail = await prisma.attendee.findUnique({
				where: {
					eventId_email: {  // não é um campo do BD, é apenas um index da combinação de eventId e email
						email,
						eventId,
					}   
				}
			})

			// verifica se conseguiu encontrar um participante com o email
			if (attendeeFromEmail !== null) { 
				throw new BadRequest('This email is already registred for this event.')
			}

			// quando há duas funções que levarão um tempo para serem executadas como:

			// const event = await prisma.event.findUnique({
			//     where: {
			//         id: eventId,
			//     }
			// })

			// const amountOfAttendeesForEvent = await prisma.attendee.count({
			//     where: {
			//         eventId,
			//     }
			// })

			// podemos melhorar a eficiência dele da seguinte forma:

			const [ event, amountOfAttendeesForEvent ] = await Promise.all([
				prisma.event.findUnique({
					where: {
						id: eventId,
					}
				}),
				prisma.attendee.count({
					where: {
						eventId,
					}
				})
			])

			if (event?.maximumAttendees && amountOfAttendeesForEvent >= event?.maximumAttendees) {
				throw new BadRequest('The maximum number of attendees of this event has been reached.')
			}

			// caso a table não recarregar no prisma., restartar o ts server
			const attendee = await prisma.attendee.create({
				data: {
					name,
					email,
					eventId,
				}
			})

			return reply.status(201).send({ attendeeId: attendee.id })
		})
}