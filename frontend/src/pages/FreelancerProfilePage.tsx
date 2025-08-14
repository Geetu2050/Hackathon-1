import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, MapPin, Clock, DollarSign, Mail, MessageCircle, Download, ExternalLink, Award, Users, Calendar } from 'lucide-react';
import { freelancers } from '../data/mockData';
import { formatCurrency, formatDate, getExperienceColor, getLocationColor } from '../utils/helpers';

const FreelancerProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<'portfolio' | 'reviews' | 'skills'>('portfolio');
  
  // Find freelancer by ID
  const freelancer = freelancers.find(f => f.id === id);
  
  if (!freelancer) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Freelancer Not Found</h1>
          <Link to="/freelancers" className="text-blue-600 hover:text-blue-500">
            Back to Freelancers
          </Link>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'portfolio', label: 'Portfolio', count: freelancer.portfolio.length },
    { id: 'reviews', label: 'Reviews', count: freelancer.reviews.length },
    { id: 'skills', label: 'Skills', count: freelancer.skills.length },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Info */}
            <div className="lg:col-span-2">
              <div className="flex items-start space-x-6">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="relative"
                >
                  <img
                    src={freelancer.avatar}
                    alt={freelancer.name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-lg"
                  />
                  {freelancer.isVerified && (
                    <div className="absolute -bottom-2 -right-2 bg-blue-500 text-white p-1 rounded-full">
                      <Award className="w-4 h-4" />
                    </div>
                  )}
                </motion.div>
                
                <div className="flex-1">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      {freelancer.name}
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 mb-3">
                      {freelancer.title}
                    </p>
                    
                    {/* Rating */}
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${
                              i < Math.floor(freelancer.rating)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-gray-600 dark:text-gray-400">
                        {freelancer.rating} ({freelancer.reviews.length} reviews)
                      </span>
                    </div>

                    {/* Location and Experience */}
                    <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span className={getLocationColor(freelancer.location)}>
                          {freelancer.location}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        <span className={getExperienceColor(freelancer.experience)}>
                          {freelancer.experience} years
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        <span>{freelancer.completedJobs} jobs completed</span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-4"
            >
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center">
                <MessageCircle className="w-5 h-5 mr-2" />
                Send Message
              </button>
              <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center">
                <Mail className="w-5 h-5 mr-2" />
                Hire Now
              </button>
              <button className="w-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center">
                <Download className="w-5 h-5 mr-2" />
                Download CV
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2">
            {/* About */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">About</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {freelancer.bio}
              </p>
            </motion.div>

            {/* Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
            >
              {/* Tab Navigation */}
              <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="flex space-x-8 px-6">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                      }`}
                    >
                      {tab.label}
                      <span className="ml-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-300 py-0.5 px-2.5 rounded-full text-xs font-medium">
                        {tab.count}
                      </span>
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'portfolio' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {freelancer.portfolio.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="group cursor-pointer"
                      >
                        <div className="relative overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700 aspect-video">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
                        </div>
                        <div className="mt-3">
                          <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {item.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {item.description}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="space-y-6">
                    {freelancer.reviews.map((review, index) => (
                      <motion.div
                        key={review.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-b-0"
                      >
                        <div className="flex items-start space-x-4">
                          <img
                            src={review.clientAvatar}
                            alt={review.clientName}
                            className="w-10 h-10 rounded-full"
                          />
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h4 className="font-semibold text-gray-900 dark:text-white">
                                {review.clientName}
                              </h4>
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < review.rating
                                        ? 'text-yellow-400 fill-current'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 mb-2">
                              {review.comment}
                            </p>
                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                              <Calendar className="w-4 h-4 mr-1" />
                              {formatDate(review.date)}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {activeTab === 'skills' && (
                  <div className="space-y-4">
                    {freelancer.skills.map((skill, index) => (
                      <motion.div
                        key={skill.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="flex items-center justify-between"
                      >
                        <span className="font-medium text-gray-900 dark:text-white">
                          {skill.name}
                        </span>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${skill.proficiency}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-600 dark:text-gray-400 w-12 text-right">
                            {skill.proficiency}%
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="space-y-6"
          >
            {/* Hourly Rate */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Hourly Rate</h3>
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                {formatCurrency(freelancer.hourlyRate)}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">per hour</p>
            </div>

            {/* Availability */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Availability</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Available for:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {freelancer.availability}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Response time:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {freelancer.responseTime}
                  </span>
                </div>
              </div>
            </div>

            {/* Languages */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Languages</h3>
              <div className="space-y-2">
                {freelancer.languages?.map((language) => (
                  <div key={language.name} className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">{language.name}</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {language.level}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Contact</h3>
              <div className="space-y-3">
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <Mail className="w-4 h-4 mr-3" />
                  <span>{freelancer.email}</span>
                </div>
                {freelancer.website && (
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <ExternalLink className="w-4 h-4 mr-3" />
                    <a
                      href={freelancer.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      Visit Website
                    </a>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default FreelancerProfilePage;
