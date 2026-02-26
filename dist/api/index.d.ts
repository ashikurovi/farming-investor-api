import type { IncomingMessage, ServerResponse } from 'http';
type VercelLikeResponse = ServerResponse & {
    status(code: number): VercelLikeResponse;
    json?(body: unknown): void;
    send?(body: unknown): void;
};
export default function handler(req: IncomingMessage, res: VercelLikeResponse): Promise<any>;
export {};
