
import React, { useState } from 'react';
import { LeafIcon, MailIcon, LockIcon, EyeIcon, GoogleIcon } from '../components/Icons';

interface LoginPageProps {
  onLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <div className="min-h-screen bg-emerald-50 dark:bg-gray-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-primary rounded-full p-3 mb-4">
            <LeafIcon className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Welcome to Agriphyt</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Sign in to your account</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <button className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg flex items-center justify-center space-x-2 hover:bg-blue-700 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M9 12h6"/><path d="M10.5 7.5 9 12l1.5 4.5"/><path d="M13.5 7.5 15 12l-1.5 4.5"/><path d="M2 12C2 6.5 6.5 2 12 2s10 4.5 10 10-4.5 10-10 10S2 17.5 2 12Z"/></svg>
            <span>Sign in with Netlify Identity</span>
          </button>

          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
            <span className="flex-shrink mx-4 text-gray-400 text-sm">Or continue with email</span>
            <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
            <div className="mb-4">
              <label className="block text-gray-600 dark:text-gray-300 text-sm font-medium mb-2" htmlFor="email">
                Email
              </label>
              <div className="relative">
                <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  defaultValue="sloumatagougui@gmail.com"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-dark/50 focus:border-primary-dark outline-none transition"
                  placeholder="you@example.com"
                />
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-gray-600 dark:text-gray-300 text-sm font-medium mb-2" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="password"
                  type={passwordVisible ? 'text' : 'password'}
                  defaultValue="••••••••••••"
                  className="w-full pl-10 pr-10 py-3 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-dark/50 focus:border-primary-dark outline-none transition"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 hover:text-gray-600"
                >
                  <EyeIcon />
                </button>
              </div>
            </div>
            <button type="submit" className="w-full bg-primary text-white font-semibold py-3 rounded-lg hover:bg-primary-dark transition-colors">
              Sign In
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            Don't have an account? <a href="#" className="font-semibold text-primary hover:underline">Sign up</a>
          </p>
        </div>

        <div className="mt-6">
           <button className="w-full bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 dark:hover:bg-gray-700 font-semibold py-3 px-4 rounded-lg border border-gray-200 dark:border-gray-600 flex items-center justify-center hover:bg-gray-50 transition-colors">
            <GoogleIcon className="h-6 w-6 mr-3" />
            <div>
                <span className="font-bold">Verify with Gmail</span>
                <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">+ Enable Drive Storage</span>
            </div>
           </button>
           <ul className="text-xs text-gray-500 dark:text-gray-400 mt-3 space-y-1 pl-2">
            <li className="flex items-center"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2 text-gray-400"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>Confirms your Gmail account</li>
            <li className="flex items-center"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2 text-gray-400"><circle cx="12" cy="12" r="10"/><path d="m12 16 4-4-4-4"/></svg>Enables cloud backup & sync</li>
            <li className="flex items-center"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2 text-gray-400"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>Secure OAuth 2.0 authentication</li>
           </ul>
        </div>
        <div className="text-center text-xs text-gray-400 bg-gray-100 dark:bg-gray-800 dark:text-gray-500 p-2 rounded-lg mt-6">
            Demo: Use any email/password OR try Netlify Identity for full authentication
        </div>
      </div>
    </div>
  );
};

export default LoginPage;