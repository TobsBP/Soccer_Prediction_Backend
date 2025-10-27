import type { FastifyTypedInstance } from './types'
import { uploadMatches } from './resolvers/uploadMatches';
import { getMatches } from './resolvers/getMatches';
import z from "zod"

export async function routes(server: FastifyTypedInstance) {
  server.get('/uploadMatches', {
    schema: {
      description: 'Upload Complete',
    },
  }, uploadMatches);

  server.get('/getMatches', {
    schema: {
      description: 'Get all Matches',
    } 
  }, getMatches);
}