import type { FastifyTypedInstance } from '../types'
import { matchRoutes } from './matches';
import { teamRoutes } from './teams';
import { aiRoutes } from './predictions';

export async function routes(server: FastifyTypedInstance) {
  server.register(matchRoutes);
  server.register(teamRoutes);
  server.register(aiRoutes);
}
