import React, { useState } from 'react';
import InputField from './InputField';
import { auth, googleProvider } from '../config/firebase';
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const signIn = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      console.log('User Created');
    } catch (error) {
      console.error('Signup Error:', error.message);
      alert(error.message);
    }
  };

  const signInWithGoogle = async (e) => {
    e.preventDefault();
    try {
      await signInWithPopup(auth, googleProvider);
      console.log('User Created');
    } catch (error) {
      console.error('Signup Error:', error.message);
      alert(error.message);
    }
  };

  return (
    <>
      <div className="flex justify-center items-center min-h-screen bg-gray-950 text-white px-4 py-8">
        <div className="bg-gray-900 w-full max-w-md rounded-xl shadow-xl p-8 space-y-6">
          <h2 className="text-3xl font-bold text-center mb-4 text-green-400">
            Sign Up to TradeSathi
          </h2>

          {/* Social Login */}
          <div className="flex justify-center gap-6">
            {/* Google */}
            <button onClick={signInWithGoogle} className="p-2 hover:opacity-80 transition">
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google login"
                className="w-6 h-6"
              />
            </button>

            {/* Microsoft */}
            <button onClick={() => alert('Microsoft login not implemented')} className="p-2 hover:opacity-80 transition">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg"
                alt="Microsoft login"
                className="w-6 h-6"
              />
            </button>

            {/* Apple */}
            <button onClick={() => alert('Apple login not implemented')} className="p-2 hover:opacity-80 transition">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg"
                alt="Apple login"
                className="w-6 h-6 invert"
              />
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 text-gray-400">
            <hr className="flex-grow border-gray-700" />
            <span className="text-sm">or</span>
            <hr className="flex-grow border-gray-700" />
          </div>

          {/* Sign Up Form */}
          <form className="space-y-4">
            <InputField
              type="email"
              placeholder="Email address"
              onChange={(e) => setEmail(e.target.value)}
            />
            <InputField
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="submit"
              className="w-full bg-green-400 text-black font-bold py-2 rounded-full hover:bg-green-300 transition"
              onClick={signIn}
            >
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
