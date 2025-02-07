import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader, Eye, EyeOff } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import * as authService from '../../services/auth.service';

const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const { token, user } = await authService.login(formData.email, formData.password);
      localStorage.setItem('token', token);
      login(user, token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl">
          <h2 className="text-center text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500 mb-8">
            Sign in to your account
          </h2>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="text-sm text-red-700">{error}</div>
              </div>
            )}

            <div className="space-y-4">
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 transition-all duration-300 
                         focus:ring-2 focus:ring-indigo-500 focus:border-transparent 
                         hover:border-indigo-300"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
              />

              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 transition-all duration-300
                           focus:ring-2 focus:ring-indigo-500 focus:border-transparent 
                           hover:border-indigo-300 pr-12"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-indigo-500 transition-colors duration-200"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center py-3 px-4 rounded-lg
                       text-white bg-gradient-to-r from-indigo-600 to-blue-500 
                       hover:from-indigo-700 hover:to-blue-600
                       transition-all duration-300 transform hover:scale-105
                       disabled:opacity-50 space-x-2"
            >
              {isLoading && <Loader className="w-5 h-5 animate-spin" />}
              <span>Sign in</span>
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/register"
              className="font-medium text-indigo-600 hover:text-indigo-500 
                       transition-colors duration-300"
            >
              Don't have an account? Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;