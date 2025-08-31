'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../lib/useAuth';

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const { signIn, signUp, signInWithGoogle } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const result = isLogin
                ? await signIn(email, password)
                : await signUp(email, password);

            if (result.success) {
                setSuccess(isLogin ? '로그인 성공!' : '회원가입 성공!');
                setTimeout(() => {
                    router.push('/');
                }, 1500);
            } else {
                setError(result.error || '오류가 발생했습니다.');
            }
        } catch (err) {
            setError('알 수 없는 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const result = await signInWithGoogle();
            if (result.success) {
                setSuccess('Google 로그인 성공!');
                setTimeout(() => {
                    router.push('/');
                }, 1500);
            } else {
                setError(result.error || 'Google 로그인에 실패했습니다.');
            }
        } catch (err) {
            setError('Google 로그인 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {/* 헤더 */}
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i className="ri-suitcase-line text-3xl text-blue-600"></i>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">TravelReceipt</h1>
                    <p className="text-gray-600">
                        {isLogin ? '여행 기록을 계속하세요' : '새로운 여행을 시작하세요'}
                    </p>
                </div>

                {/* 로그인/회원가입 카드 */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    {/* 탭 전환 */}
                    <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
                        <button
                            onClick={() => setIsLogin(true)}
                            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${isLogin
                                    ? 'bg-white text-blue-600 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            로그인
                        </button>
                        <button
                            onClick={() => setIsLogin(false)}
                            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${!isLogin
                                    ? 'bg-white text-blue-600 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            회원가입
                        </button>
                    </div>

                    {/* 폼 */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                이메일
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                placeholder="your@email.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                비밀번호
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                placeholder="••••••••"
                                minLength={6}
                            />
                        </div>

                        {/* 에러/성공 메시지 */}
                        {error && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-sm text-red-600">{error}</p>
                            </div>
                        )}

                        {success && (
                            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                                <p className="text-sm text-green-600">{success}</p>
                            </div>
                        )}

                        {/* 로그인/회원가입 버튼 */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                    {isLogin ? '로그인 중...' : '회원가입 중...'}
                                </div>
                            ) : (
                                isLogin ? '로그인' : '회원가입'
                            )}
                        </button>
                    </form>

                    {/* 구분선 */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">또는</span>
                        </div>
                    </div>

                    {/* Google 로그인 버튼 */}
                    <button
                        onClick={handleGoogleSignIn}
                        disabled={loading}
                        className="w-full py-3 px-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                    >
                        <i className="ri-google-fill text-lg mr-2 text-red-500"></i>
                        Google로 {isLogin ? '로그인' : '회원가입'}
                    </button>

                    {/* 추가 정보 */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            {isLogin ? '계정이 없으신가요?' : '이미 계정이 있으신가요?'}
                            <button
                                onClick={() => setIsLogin(!isLogin)}
                                className="text-blue-600 hover:text-blue-700 font-medium ml-1"
                            >
                                {isLogin ? '회원가입' : '로그인'}
                            </button>
                        </p>
                    </div>
                </div>

                {/* 푸터 */}
                <div className="text-center mt-8">
                    <p className="text-xs text-gray-500">
                        로그인하면 TravelReceipt의{' '}
                        <a href="/terms" className="text-blue-600 hover:text-blue-700">
                            이용약관
                        </a>
                        과{' '}
                        <a href="/privacy" className="text-blue-600 hover:text-blue-700">
                            개인정보처리방침
                        </a>
                        에 동의하는 것으로 간주됩니다.
                    </p>
                </div>
            </div>
        </div>
    );
}
