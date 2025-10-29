import { FastifyRequest, FastifyReply, HookHandlerDoneFunction } from 'fastify';                    

export const authenticateApiKey = (request: FastifyRequest, reply: FastifyReply, done: HookHandlerDoneFunction) => {                                     
  const apiKey = request.headers['x-api-key'];                                                                                                           
  const expectedApiKey = process.env.API_UPLOAD_KEY;                                                                                                  

  if (!apiKey || apiKey !== expectedApiKey) {                                                                                                            
    reply.status(401).send({ message: 'Unauthorized: Invalid or missing API Key' });                                                                     
    return;                                                                                                                                             
  }                                                                                                                                                   
  done();                                                                         
};