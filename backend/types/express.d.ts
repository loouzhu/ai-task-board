import "express-session";

declare global {
  namespace Express {
    interface UserPayload {
      userId: string;
      username: string;
      createdAt?: Date;
    }

    interface Request {
      user?: UserPayload;
    }
  }
}

declare module "express-session" {
  interface SessionData {
    userId?: string;
  }
}

export {};
