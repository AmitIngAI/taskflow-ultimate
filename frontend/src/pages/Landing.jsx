import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  CheckCircle, 
  Zap, 
  Users, 
  BarChart3, 
  Shield,
  Star,
  Github,
  Twitter,
  Linkedin
} from 'lucide-react';
import { Button } from '../components/common';
import { motion } from 'framer-motion';

const Landing = () => {
  const features = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Real-time collaboration with instant updates across your team',
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Work together seamlessly with built-in communication tools',
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Track progress with powerful insights and reporting',
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Bank-level encryption and security for your data',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Product Manager at TechCorp',
      avatar: 'https://i.pravatar.cc/150?img=1',
      content: 'TaskFlow has revolutionized how our team manages projects. The AI features are game-changing!',
      rating: 5,
    },
    {
      name: 'Michael Chen',
      role: 'Engineering Lead at StartupXYZ',
      avatar: 'https://i.pravatar.cc/150?img=2',
      content: 'Best project management tool we\'ve used. The Kanban board is incredibly intuitive.',
      rating: 5,
    },
    {
      name: 'Emily Rodriguez',
      role: 'Designer at Creative Co',
      avatar: 'https://i.pravatar.cc/150?img=3',
      content: 'Love the clean interface and powerful features. Makes collaboration so much easier!',
      rating: 5,
    },
  ];

  const pricing = [
    {
      name: 'Free',
      price: '$0',
      features: [
        'Up to 10 team members',
        'Basic Kanban boards',
        '5GB storage',
        'Community support',
      ],
    },
    {
      name: 'Pro',
      price: '$12',
      popular: true,
      features: [
        'Unlimited team members',
        'Advanced analytics',
        '100GB storage',
        'Priority support',
        'AI-powered features',
        'Custom integrations',
      ],
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      features: [
        'Everything in Pro',
        'Dedicated account manager',
        'Unlimited storage',
        'Custom SLA',
        'Advanced security',
        'On-premise deployment',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-dark-900">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-dark-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-dark-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg flex items-center justify-center shadow-lg shadow-primary-500/30">
              <span className="text-white font-bold text-lg">T</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                TaskFlow
              </span>
            </Link>

            {/* Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-600 dark:text-gray-300 hover:text-primary-600">
                Features
              </a>
              <a href="#pricing" className="text-gray-600 dark:text-gray-300 hover:text-primary-600">
                Pricing
              </a>
              <a href="#testimonials" className="text-gray-600 dark:text-gray-300 hover:text-primary-600">
                Testimonials
              </a>
            </div>

            {/* CTA */}
            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link to="/register">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6">
              Project Management
              <br />
              <span className="bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                Reimagined
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-8">
              The all-in-one workspace for teams to plan, track, and ship faster.
              AI-powered insights meet beautiful design.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link to="/register">
                <Button size="lg" icon={ArrowRight} iconPosition="right">
                  Start Free Trial
                </Button>
              </Link>
              <Button size="lg" variant="outline">
                Watch Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mt-16">
              <div>
                <p className="text-4xl font-bold text-primary-600">10K+</p>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Active Teams</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-primary-600">99.9%</p>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Uptime</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-primary-600">4.9/5</p>
                <p className="text-gray-600 dark:text-gray-400 mt-1">User Rating</p>
              </div>
            </div>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-20"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-dark-900 via-transparent to-transparent z-10" />
              
              {/* Glow effect */}
              <div className="absolute inset-0 bg-primary-500/20 blur-3xl rounded-3xl" />
              
              <img
                src="https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=1200&auto=format&fit=crop"
                alt="Dashboard Preview"
                className="relative rounded-2xl shadow-2xl border border-gray-200 dark:border-dark-700"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50 dark:bg-dark-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Everything you need to succeed
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Powerful features designed for modern teams
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-dark-700 hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Loved by teams worldwide
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              See what our customers have to say
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-dark-700"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center gap-3">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50 dark:bg-dark-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Choose the plan that's right for your team
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {pricing.map((plan, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className={`bg-white dark:bg-dark-800 rounded-xl p-8 shadow-sm border-2 ${
                  plan.popular
                    ? 'border-primary-500 relative'
                    : 'border-gray-200 dark:border-dark-700'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-primary-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}

                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {plan.name}
                </h3>
                <div className="mb-6">
                  <span className="text-5xl font-bold text-gray-900 dark:text-white">
                    {plan.price}
                  </span>
                  {plan.price !== 'Custom' && (
                    <span className="text-gray-600 dark:text-gray-400">/month</span>
                  )}
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600 dark:text-gray-400">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  variant={plan.popular ? 'primary' : 'outline'}
                  className="w-full"
                >
                  {plan.price === 'Custom' ? 'Contact Sales' : 'Get Started'}
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Ready to get started?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
              Join thousands of teams already using TaskFlow
            </p>
            <Link to="/register">
              <Button size="lg" icon={ArrowRight} iconPosition="right">
                Start Your Free Trial
              </Button>
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-4">
              No credit card required • 14-day free trial
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-dark-800/50 border-t border-gray-200 dark:border-dark-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">T</span>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                  TaskFlow
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                The modern way to manage projects and collaborate with your team.
              </p>
            </div>

            {/* Product */}
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 text-sm">Features</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 text-sm">Pricing</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 text-sm">Integrations</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 text-sm">Changelog</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 text-sm">About</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 text-sm">Blog</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 text-sm">Careers</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 text-sm">Contact</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 text-sm">Privacy</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 text-sm">Terms</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 text-sm">Security</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-dark-700 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © 2026 TaskFlow. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary-600">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary-600">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary-600">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;