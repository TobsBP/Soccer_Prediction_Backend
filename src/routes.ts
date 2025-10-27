import type { FastifyTypedInstance } from './types'
import { uploadMatches } from './resolvers/uploadMatches';
import { getMatches } from './resolvers/getMatches';
import { getTeams } from './resolvers/getTeams';

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

  server.get('/getTeams', {
    schema: {
      description: 'Get all Teams',
    } 
  }, getTeams);
}