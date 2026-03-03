import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { Input, Button } from '../components/common';
import { useAuthStore } from '../store/useStore';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });

  // Password strength checker
  const getPasswordStrength = (password) => {
    let strength = 0;
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    strength = Object.values(checks).filter(Boolean).length;

    return {
      score: strength,
      checks,
      label: strength <= 1 ? 'Weak' : strength <= 3 ? 'Medium' : strength <= 4 ? 'Strong' : 'Very Strong',
      color: strength <= 1 ? 'red' : strength <= 3 ? 'yellow' : strength <= 4 ? 'green' : 'emerald',
    };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    } else if (!/^[a-zA-Z\s]+$/.test(formData.name.trim())) {
      newErrors.name = 'Name can only contain letters and spaces';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (passwordStrength.score < 3) {
      newErrors.password = 'Password is too weak. Add uppercase, numbers, or special characters.';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Terms validation
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the Terms of Service and Privacy Policy';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate before submitting
    if (!validateForm()) {
      toast.error('Please fill all required fields correctly');
      return;
    }

    setLoading(true);

    try {
      // Real API call
      const response = await authService.register({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      login(response.user, response.token);
      toast.success('Account created successfully! 🎉');
      navigate('/dashboard');
    } catch (error) {
      console.error('Register error:', error);
      
      const statusCode = error.response?.status;
      const message = error.response?.data?.message || '';

      // Handle specific error cases
      if (statusCode === 409 || statusCode === 400 || message.toLowerCase().includes('already') || message.toLowerCase().includes('exists') || message.toLowerCase().includes('registered')) {
        // Email already registered
        toast.error(
          (t) => (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <span className="font-semibold">Email Already Registered!</span>
              </div>
              <p className="text-sm text-gray-600">This email is already associated with an account.</p>
              <button
                onClick={() => {
                  toast.dismiss(t.id);
                  navigate('/login');
                }}
                className="mt-2 px-4 py-2 bg-primary-500 text-white rounded-lg text-sm hover:bg-primary-600 transition-colors"
              >
                Go to Login
              </button>
            </div>
          ),
          {
            duration: 6000,
            style: {
              maxWidth: '400px',
            },
          }
        );
        setErrors({ email: 'This email is already registered. Please login instead.' });
      } else {
        // Generic error
        toast.error(message || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle input change and clear error
  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Create Account
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Get started with TaskFlow today
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Full Name */}
        <div>
          <Input
            label="Full Name"
            type="text"
            icon={User}
            placeholder="Enter your full name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            required
            className={errors.name ? 'border-red-500 focus:ring-red-500' : ''}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.name}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <Input
            label="Email"
            type="email"
            icon={Mail}
            placeholder="Enter your email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            required
            className={errors.email ? 'border-red-500 focus:ring-red-500' : ''}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.email}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            icon={Lock}
            placeholder="Create a strong password"
            value={formData.password}
            onChange={(e) => handleChange('password', e.target.value)}
            required
            className={errors.password ? 'border-red-500 focus:ring-red-500' : ''}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
          
          {/* Password Strength Indicator */}
          {formData.password && (
            <div className="mt-2">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex-1 h-2 bg-gray-200 dark:bg-dark-600 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      passwordStrength.score <= 1
                        ? 'bg-red-500 w-1/5'
                        : passwordStrength.score <= 2
                        ? 'bg-orange-500 w-2/5'
                        : passwordStrength.score <= 3
                        ? 'bg-yellow-500 w-3/5'
                        : passwordStrength.score <= 4
                        ? 'bg-green-500 w-4/5'
                        : 'bg-emerald-500 w-full'
                    }`}
                  />
                </div>
                <span
                  className={`text-xs font-medium ${
                    passwordStrength.score <= 1
                      ? 'text-red-500'
                      : passwordStrength.score <= 2
                      ? 'text-orange-500'
                      : passwordStrength.score <= 3
                      ? 'text-yellow-500'
                      : 'text-green-500'
                  }`}
                >
                  {passwordStrength.label}
                </span>
              </div>
              
              {/* Password Requirements */}
              <div className="grid grid-cols-2 gap-1 text-xs">
                <div className={`flex items-center gap-1 ${passwordStrength.checks.length ? 'text-green-500' : 'text-gray-400'}`}>
                  <CheckCircle className="w-3 h-3" />
                  <span>8+ characters</span>
                </div>
                <div className={`flex items-center gap-1 ${passwordStrength.checks.uppercase ? 'text-green-500' : 'text-gray-400'}`}>
                  <CheckCircle className="w-3 h-3" />
                  <span>Uppercase letter</span>
                </div>
                <div className={`flex items-center gap-1 ${passwordStrength.checks.lowercase ? 'text-green-500' : 'text-gray-400'}`}>
                  <CheckCircle className="w-3 h-3" />
                  <span>Lowercase letter</span>
                </div>
                <div className={`flex items-center gap-1 ${passwordStrength.checks.number ? 'text-green-500' : 'text-gray-400'}`}>
                  <CheckCircle className="w-3 h-3" />
                  <span>Number</span>
                </div>
                <div className={`flex items-center gap-1 ${passwordStrength.checks.special ? 'text-green-500' : 'text-gray-400'}`}>
                  <CheckCircle className="w-3 h-3" />
                  <span>Special character</span>
                </div>
              </div>
            </div>
          )}
          
          {errors.password && (
            <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.password}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="relative">
          <Input
            label="Confirm Password"
            type={showConfirmPassword ? 'text' : 'password'}
            icon={Lock}
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={(e) => handleChange('confirmPassword', e.target.value)}
            required
            className={errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : ''}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
          >
            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
          
          {/* Match indicator */}
          {formData.confirmPassword && (
            <p className={`mt-1 text-sm flex items-center gap-1 ${
              formData.password === formData.confirmPassword ? 'text-green-500' : 'text-red-500'
            }`}>
              {formData.password === formData.confirmPassword ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Passwords match
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4" />
                  Passwords do not match
                </>
              )}
            </p>
          )}
          
          {errors.confirmPassword && !formData.confirmPassword && (
            <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.confirmPassword}
            </p>
          )}
        </div>

        {/* Terms & Conditions */}
        <div>
          <label className="flex items-start gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.agreeTerms}
              onChange={(e) => handleChange('agreeTerms', e.target.checked)}
              className={`mt-1 rounded ${errors.agreeTerms ? 'border-red-500' : ''}`}
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              I agree to the{' '}
              <Link to="/terms" className="text-primary-600 hover:text-primary-700">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-primary-600 hover:text-primary-700">
                Privacy Policy
              </Link>
              <span className="text-red-500"> *</span>
            </span>
          </label>
          {errors.agreeTerms && (
            <p className="mt-1 text-sm text-red-500 flex items-center gap-1 ml-6">
              <AlertCircle className="w-4 h-4" />
              {errors.agreeTerms}
            </p>
          )}
        </div>

        <Button type="submit" className="w-full" loading={loading}>
          Create Account
        </Button>

        <div className="text-center">
          <span className="text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
          </span>
          <Link
            to="/login"
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Sign in
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Register;