import type { IncomingMessage, ServerResponse } from "http";
import app from "../server";

/**
 * Vercel Serverless Function entry point.
 * Forwards requests to the Express application.
 */
export default function handler(req: IncomingMessage, res: ServerResponse) {
  return app(req, res);
}
