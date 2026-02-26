import type { IncomingMessage, ServerResponse } from 'http';
import { getApp } from '../src/get-app';

type VercelLikeResponse = ServerResponse & {
  status(code: number): VercelLikeResponse;
  json?(body: unknown): void;
  send?(body: unknown): void;
};

export default async function handler(req: IncomingMessage, res: VercelLikeResponse) {
  // 🔥 FORCE CORS HEADERS (this is the fix)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization',
  );

  // Preflight
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  const app = await getApp();
  const server = app.getHttpAdapter().getInstance();
  return server(req, res);
}
