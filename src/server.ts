import fastify from "fastify";

import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUI from "@fastify/swagger-ui";
import fastifyCors  from "@fastify/cors";

import { serializerCompiler, validatorCompiler, jsonSchemaTransform } from "fastify-type-provider-zod";
import { createEvent } from "./routes/create-event";
import { registerForEvenet } from "./routes/register-for-event";
import { getEvent } from "./routes/get-event";
import { getAttendeeBadge } from "./routes/get-attendee-badge";
import { checkIn } from "./routes/check-in";
import { getEventAttendees } from "./routes/get-event-attendees";
import { errorHandler } from "./error-handle";

const app = fastify()

app.register(fastifyCors, {
	origin: '*',
})

// documentação da API - localhost:3333/docs
app.register(fastifySwagger, {
	swagger: {
		consumes: ['application/json'],
		produces: ['application/json'],
		info: {
			title: 'pass.in',
			description: 'Especificações da API para o back-end da aplicação pass.in construida durante o NLW Unite da Rocketseat',
			version: '1.0.0',
		},
	},
	transform: jsonSchemaTransform,
})

app.register(fastifySwaggerUI, {
	routePrefix: '/docs',
})

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(createEvent) // rota de cadastro de eventos
app.register(registerForEvenet) // rota de criação de participantes
app.register(getEvent) // rota de listagem de eventos
app.register(getAttendeeBadge) // rota de listagem de crachás
app.register(checkIn) // rota de check-in
app.register(getEventAttendees) // rota de listagem de participantes

app.setErrorHandler(errorHandler) // pega os erros com status code correto

// running server
app.listen({
	port: 3333,
	host: '0.0.0.0',
}).then(() => {
	console.log('HTTP server running!')
})