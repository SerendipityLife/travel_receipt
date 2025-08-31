'use client';

import LoginForm from '../../components/LoginForm';
import { useAuth } from '../../lib/useAuth';

export default function AuthTestPage() {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">로딩 중...</div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              로그인 성공! 🎉
            </h2>
          </div>
          
          <div className="bg-white shadow rounded-lg p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">이메일</label>
                <p className="mt-1 text-sm text-gray-900">{user.email}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">사용자 ID</label>
                <p className="mt-1 text-sm text-gray-900">{user.uid}</p>
              </div>
              
              {user.displayName && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">이름</label>
                  <p className="mt-1 text-sm text-gray-900">{user.displayName}</p>
                </div>
              )}
              
              {user.photoURL && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">프로필 사진</label>
                  <img 
                    src={user.photoURL} 
                    alt="Profile" 
                    className="mt-1 h-10 w-10 rounded-full"
                  />
                </div>
              )}
            </div>
            
            <div className="mt-6">
              <button
                onClick={logout}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                로그아웃
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <LoginForm />;
}
