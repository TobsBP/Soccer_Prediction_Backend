import type { FastifyTypedInstance } from '../types'
import { matchRoutes } from './matches';
import { teamRoutes } from './teams';

export async function routes(server: FastifyTypedInstance) {
  server.register(matchRoutes);
  server.register(teamRoutes);
}
