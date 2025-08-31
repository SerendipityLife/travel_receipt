import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack);

  if (err.name === 'ValidationError') {
    res.status(400).json({
      message: 'Validation Error',
      error: err.message
    });
    return;
  }

  if (err.name === 'CastError') {
    res.status(400).json({
      message: 'Invalid ID format',
      error: err.message
    });
    return;
  }

  if (err.name === 'MongoError' && (err as any).code === 11000) {
    res.status(400).json({
      message: 'Duplicate field value',
      error: err.message
    });
    return;
  }

  res.status(500).json({
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
  return;
};
