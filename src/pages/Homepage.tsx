
import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Droplet, Thermometer, BarChart3, Bell, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Homepage = () => {
  const features = [
    {
      icon: Thermometer,
      title: 'Temperature Monitoring',
      description: 'Real-time temperature tracking with automated alerts for optimal crop growth.',
    },
    {
      icon: Droplet,
      title: 'Humidity Control',
      description: 'Monitor soil and air humidity levels to ensure perfect growing conditions.',
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Comprehensive data analysis and insights for better farming decisions.',
    },
    {
      icon: Bell,
      title: 'Smart Alerts',
      description: 'Instant notifications when sensor values exceed optimal ranges.',
    },
    {
      icon: Database,
      title: 'Data Storage',
      description: 'Secure cloud storage of all your farming data with easy access.',
    },
    {
      icon: Leaf,
      title: 'Eco-Friendly',
      description: 'Sustainable farming practices powered by smart technology.',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 via-green-100 to-emerald-100 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Smart Farming
              <span className="text-green-600 block">Monitoring System</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Monitor your crops with precision using IoT sensors for temperature, humidity, pH levels, and more. 
              Make data-driven decisions for optimal harvest yields.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/dashboard">
                <Button size="lg" className="bg-green-600 hover:bg-green-700 text-lg px-8 py-4">
                  View Dashboard
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need for Smart Farming
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our comprehensive IoT solution provides real-time monitoring and intelligent insights 
              to optimize your farming operations.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
              >
                <div className="bg-green-100 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                  <feature.icon className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-green-600 to-emerald-700 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Farm?
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Join thousands of farmers who are already using our smart monitoring system 
            to increase yields and reduce costs.
          </p>
          <Link to="/contact">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
              Contact Us Today
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Homepage;
