import { Request, Response, NextFunction } from 'express';
import { getFirebaseAuth } from '../config/firebase';
import { RequestWithUser } from '../types/request';

// RequestWithUser 인터페이스는 types/request.ts에서 import

// Firebase Auth 미들웨어 (기본)
export const auth = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        message: 'No token provided',
        error: 'Authorization header must start with Bearer'
      });
      return;
    }

    const token = authHeader.split('Bearer ')[1];
    
    // 임시로 토큰 검증 비활성화 (테스트용)
    console.log('토큰 수신:', token ? '토큰 있음' : '토큰 없음');
    
    // 테스트용 사용자 정보 설정
    req.user = {
      id: 'test-user-id',
      email: 'test@example.com',
      name: 'Test User',
      avatar: undefined
    };

    next();
    
    /* 원래 코드 (주석 처리)
    const firebaseAuth = getFirebaseAuth();
    const decodedToken = await firebaseAuth.verifyIdToken(token);

    // 사용자 정보를 request 객체에 추가
    req.user = {
      id: decodedToken.uid,
      email: decodedToken.email || undefined,
      name: decodedToken.name || undefined,
      avatar: decodedToken.picture || undefined
    };

    next();
    */
  } catch (error) {
    console.error('Firebase Auth Middleware Error:', error);

    if (error instanceof Error) {
      if (error.message.includes('Token has been revoked')) {
        res.status(401).json({
          message: 'Token has been revoked',
          error: 'Please login again'
        });
        return;
      }

      if (error.message.includes('Token is expired')) {
        res.status(401).json({
          message: 'Token is expired',
          error: 'Please login again'
        });
        return;
      }
    }

    res.status(401).json({
      message: 'Invalid token',
      error: 'Authentication failed'
    });
  }
};

// 선택적 인증 미들웨어 (토큰이 있으면 사용자 정보 추가, 없어도 통과)
export const optionalAuth = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(); // 토큰이 없어도 통과
    }

    const token = authHeader.split('Bearer ')[1];
    const firebaseAuth = getFirebaseAuth();

    const decodedToken = await firebaseAuth.verifyIdToken(token);

    // 사용자 정보를 request 객체에 추가
    req.user = {
      id: decodedToken.uid,
      email: decodedToken.email || undefined,
      name: decodedToken.name || undefined,
      avatar: decodedToken.picture || undefined
    };

    next();
  } catch (error) {
    console.error('Optional Firebase Auth Middleware Error:', error);
    // 에러가 발생해도 통과 (선택적 인증이므로)
    next();
  }
};
