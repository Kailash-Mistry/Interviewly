import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    if (!userType) {
      return setError('Please select a user type');
    }

    try {
      setError('');
      setLoading(true);
      await signup(email, password, userType);
      navigate('/landing');
    } catch (error) {
      setError('Failed to create an account: ' + error.message);
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#111b21]">
      <div className="max-w-md w-full space-y-8 p-8 bg-[#202c33] rounded-lg shadow-lg">
        <div>
          <h2 className="text-center text-3xl font-bold text-white">Sign Up</h2>
        </div>
        {error && (
          <div className="bg-red-500 text-white p-3 rounded-lg text-sm">
            {error}
          </div>
        )}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="text-white text-sm">
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-[#2a3942] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005c4b]"
              />
            </div>
            <div>
              <label htmlFor="password" className="text-white text-sm">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-[#2a3942] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005c4b]"
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="text-white text-sm">
                Confirm Password
              </label>
              <input
                id="confirm-password"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-[#2a3942] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005c4b]"
              />
            </div>
            <div>
              <label className="text-white text-sm block mb-2">
                I am a:
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setUserType('interviewer')}
                  className={`py-2 px-4 rounded-lg border-2 transition-colors ${
                    userType === 'interviewer'
                      ? 'bg-[#005c4b] border-[#005c4b] text-white'
                      : 'border-[#374248] text-white hover:border-[#005c4b]'
                  }`}
                >
                  Interviewer
                </button>
                <button
                  type="button"
                  onClick={() => setUserType('interviewee')}
                  className={`py-2 px-4 rounded-lg border-2 transition-colors ${
                    userType === 'interviewee'
                      ? 'bg-[#005c4b] border-[#005c4b] text-white'
                      : 'border-[#374248] text-white hover:border-[#005c4b]'
                  }`}
                >
                  Interviewee
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#005c4b] hover:bg-[#006d5b] text-white font-semibold rounded-lg shadow-lg transition-all duration-300 disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-gray-300">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-[#5ea8ff] hover:underline font-medium"
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup; 