import type { FastifyTypedInstance } from './types'
import { getGames } from './resolvers/getGames';
import z from "zod"

export async function routes(server: FastifyTypedInstance) {
  server.get('/games', {
    schema: {
      description: 'List of maches',
    }
  }, getGames);
}