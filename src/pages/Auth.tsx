
import React, { useState } from 'react';
import LoginForm from '@/components/auth/LoginForm';
import SignupForm from '@/components/auth/SignupForm';

interface AuthProps {
  onAuthenticated: () => void;
}

const Auth = ({ onAuthenticated }: AuthProps) => {
  const [isLogin, setIsLogin] = useState(true);

  const handleLogin = (username: string, password: string) => {
    console.log('Login attempt:', { username, password });
    // Here you would typically validate credentials
    onAuthenticated();
  };

  const handleSignup = (phone: string, password: string) => {
    console.log('Signup attempt:', { phone, password });
    // Here you would typically create the user account
    onAuthenticated();
  };

  return (
    <div className="min-h-screen bg-sembrala-light-gray">
      {isLogin ? (
        <LoginForm
          onLogin={handleLogin}
          onSwitchToSignup={() => setIsLogin(false)}
        />
      ) : (
        <SignupForm
          onSignup={handleSignup}
          onSwitchToLogin={() => setIsLogin(true)}
        />
      )}
    </div>
  );
};

export default Auth;
