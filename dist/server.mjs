import {
  registerForEvenet
} from "./chunk-46CIA7HT.mjs";
import {
  errorHandler
} from "./chunk-5SM7UXZR.mjs";
import {
  checkIn
} from "./chunk-535L37OZ.mjs";
import {
  createEvent
} from "./chunk-QMU2NZLU.mjs";
import "./chunk-KDMJHR3Z.mjs";
import {
  getAttendeeBadge
} from "./chunk-BSNEN3WL.mjs";
import {
  getEventAttendees
} from "./chunk-FHK6WDMZ.mjs";
import {
  getEvent
} from "./chunk-I2GAW6WO.mjs";
import "./chunk-JRO4E4TH.mjs";
import "./chunk-JV6GRE7Y.mjs";

// src/server.ts
import fastify from "fastify";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUI from "@fastify/swagger-ui";
import fastifyCors from "@fastify/cors";
import { serializerCompiler, validatorCompiler, jsonSchemaTransform } from "fastify-type-provider-zod";
var app = fastify();
app.register(fastifyCors, {
  origin: "*"
});
app.register(fastifySwagger, {
  swagger: {
    consumes: ["application/json"],
    produces: ["application/json"],
    info: {
      title: "pass.in",
      description: "Especifica\xE7\xF5es da API para o back-end da aplica\xE7\xE3o pass.in construida durante o NLW Unite da Rocketseat",
      version: "1.0.0"
    }
  },
  transform: jsonSchemaTransform
});
app.register(fastifySwaggerUI, {
  routePrefix: "/docs"
});
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);
app.register(createEvent);
app.register(registerForEvenet);
app.register(getEvent);
app.register(getAttendeeBadge);
app.register(checkIn);
app.register(getEventAttendees);
app.setErrorHandler(errorHandler);
app.listen({
  port: 3333,
  host: "0.0.0.0"
}).then(() => {
  console.log("HTTP server running!");
});
