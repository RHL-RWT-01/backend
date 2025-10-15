import { Request, Response, NextFunction } from "express";

export function logger(req: Request, res: Response, next: NextFunction) {
  const now = new Date().toISOString();
  const { method, url } = req;
  const ip =
    req.ip || req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  console.log(`[${now}] ${method} ${url} - IP: ${ip}`);

  res.on("finish", () => {
    const endTime = new Date().toISOString();
    // Try to get route handler file from req.route or req.baseUrl
    // Fallback to url and status code
    let handlerInfo = req.route?.path
      ? `Route: ${req.baseUrl}${req.route.path}`
      : `URL: ${url}`;
    console.log(
      `[${endTime}] Ended ${method} ${handlerInfo} - Status: ${res.statusCode}`
    );
  });
  next();
}

