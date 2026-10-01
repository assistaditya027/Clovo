import { useContext, useEffect, useMemo, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';
import { LoginIcon1, LoginIcon2, LoginIcon3, LoginIcon4, LoginIcon5, LoginIcon6, LoginIcon7, LoginIcon8, LoginIcon9 } from '../assets/assets';

const Login = () => {
  const [currentState, setCurrentState] = useState('Sign Up');
  const [showPassword, setShowPassword] = useState(false);
  const { token, setToken, navigate, backendUrl } = useContext(ShopContext);
  const location = useLocation();
  const redirectTo = useMemo(() => location.state?.from || '/', [location.state]);
  const apiBase = useMemo(() => (backendUrl ? backendUrl.replace(/\/+$/, '') : ''), [backendUrl]);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      if (currentState === 'Sign Up') {
        const response = await axios.post(backendUrl + '/api/user/register', {
          name,
          email,
          password,
        });
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem('token', response.data.token);
        } else {
          toast.error(response.data.message);
        }
      } else {
        const response = await axios.post(backendUrl + '/api/user/login', { email, password });
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem('token', response.data.token);
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      console.warn(error.message);
      toast.error(error.message);
    }
  };

  const handleOAuth = (provider) => {
    if (!apiBase) {
      toast.error('Backend URL is not configured.');
      return;
    }
    const redirect = encodeURIComponent(redirectTo || '/');
    window.location.href = `${apiBase}/api/user/oauth/${provider}?redirect=${redirect}`;
  };

  useEffect(() => {
    if (token) {
      navigate(redirectTo, { replace: true });
    }
  }, [token, navigate, redirectTo]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const oauthStatus = params.get('oauth');
    if (!oauthStatus) return;
    if (oauthStatus === 'missing') {
      toast.error('OAuth is not configured on the server.');
    } else if (oauthStatus === 'email') {
      toast.error(
        'OAuth did not return an email. Please make your email public or try another method.',
      );
    } else {
      toast.error('OAuth login failed. Please try again.');
    }
  }, [location.search]);

  const isLogin = currentState === 'Login';

  return (
    <div className="flex items-center justify-center min-h-[80vh] border-t border-gray-100 dark:border-gray-800 px-4">
      <form
        onSubmit={onSubmitHandler}
        className="flex flex-col w-full sm:max-w-96 gap-4 text-gray-800 dark:text-gray-100"
      >
        {/* Header */}
        <div className="flex flex-col items-center gap-1 mb-2">
          <div className="inline-flex items-center gap-2">
            <p className="prata-regular text-3xl">{currentState}</p>
            <hr className="border-none h-[1.5px] w-8 bg-gray-800 dark:bg-gray-200" />
          </div>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
            {isLogin ? 'Welcome back! Sign in to continue.' : 'Create an account to get started.'}
          </p>
        </div>

        {/* Name (Sign Up only) */}
        {!isLogin && (
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
              <LoginIcon1 className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" />
            </span>
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              type="text"
              placeholder="Name"
              required
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-black dark:focus:border-white transition-colors"
            />
          </div>
        )}

        {/* Email */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
            <LoginIcon2 className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" />
          </span>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="email"
            placeholder="Email"
            required
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-black dark:focus:border-white transition-colors"
          />
        </div>

        {/* Password */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
            <LoginIcon3 className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" />
          </span>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            required
            className="w-full pl-10 pr-10 py-2.5 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-black dark:focus:border-white transition-colors"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            {showPassword ? (
              <LoginIcon4 className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" />
            ) : (
              <LoginIcon5 className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" />
            )}
          </button>
        </div>

        {/* Forgot / Toggle */}
        <div className="w-full flex justify-between text-sm mt-1">
          {isLogin ? (
            <p
              className="cursor-pointer text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
              onClick={() => navigate('/forgot-password')}
            >
              Forgot password?
            </p>
          ) : (
            <span />
          )}
          {isLogin ? (
            <p
              className="cursor-pointer text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
              onClick={() => setCurrentState('Sign Up')}
            >
              Don't have an account?
            </p>
          ) : (
            <p
              className="cursor-pointer text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
              onClick={() => setCurrentState('Login')}
            >
              Already have an account?
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="bg-black text-white dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 w-full py-2.5 mt-2 text-sm font-medium hover:bg-gray-800 active:scale-[0.98] transition-all duration-150 flex items-center justify-center gap-2"
        >
          {isLogin ? (
            <>
              <LoginIcon6 className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" />
              Sign In
            </>
          ) : (
            <>
              <LoginIcon7 className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" />
              Sign Up
            </>
          )}
        </button>

        {/* Divider + Social */}
        <div className="flex items-center gap-3 my-1">
          <hr className="flex-1 border-gray-200 dark:border-gray-700" />
          <span className="text-xs text-gray-400 dark:text-gray-500">or continue with</span>
          <hr className="flex-1 border-gray-200 dark:border-gray-700" />
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => handleOAuth('google')}
            className="flex-1 flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-700 py-2 text-sm text-gray-600 dark:text-gray-400 hover:border-black dark:hover:border-white hover:text-black dark:hover:text-white transition-all duration-150"
          >
            <LoginIcon8 className="w-4 h-4" viewBox="0 0 24 24" />
            Google
          </button>
          <button
            type="button"
            onClick={() => handleOAuth('github')}
            className="flex-1 flex items-center justify-center gap-2 border border-gray-300 py-2 text-sm text-gray-600 hover:border-black hover:text-black transition-all duration-150"
          >
            <LoginIcon9 className="w-4 h-4 fill-black" viewBox="0 0 24 24" />
            GitHub
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
