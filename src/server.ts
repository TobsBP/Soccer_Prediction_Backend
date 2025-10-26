import fastify from "fastify";

const server = fastify();

server.listen({port: 3333}).then(() => {
  console.log("Server is running on http://localhost:3333");
});