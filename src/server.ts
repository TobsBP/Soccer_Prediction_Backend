import { fastify } from "fastify";
import { fastifyCors } from "@fastify/cors"
import { validatorCompiler, serializerCompiler, jsonSchemaTransform } from 'fastify-type-provider-zod'
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { routes } from "./routes";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

const server = fastify().withTypeProvider<ZodTypeProvider>();

// Set to use zod
server.setValidatorCompiler(validatorCompiler)
server.setSerializerCompiler(serializerCompiler)

// Allow to front end to access all routes
server.register(fastifyCors, { origin: '*' })

server.register(fastifySwagger, {
  openapi:{
    info: {
      title: "Typed API",
      version: '1.0.0'
    }
  },
  transform: jsonSchemaTransform
})

server.register(fastifySwaggerUi, {
  routePrefix: '/docs'
})

server.register(routes)

server.listen({port: 3333}).then(() => {
  console.log("Server is running on http://localhost:3333");
});