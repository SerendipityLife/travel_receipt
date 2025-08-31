// Ensure this file is treated as a module and picked up by TypeScript
export {};

declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      id: string;
      email: string;
      name?: string;
    };
  }
}
