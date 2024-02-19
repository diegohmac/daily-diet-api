import { FastifyReply, FastifyRequest } from 'fastify';

export async function checkUserIsAuthenticated(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const sessionCookie = request.cookies.sessionCookie;

  if (!sessionCookie) {
    return reply.status(401).send({
      error: 'Unauthorized',
    });
  }
}
