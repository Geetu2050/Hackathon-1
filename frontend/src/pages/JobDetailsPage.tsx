import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  DollarSign, 
  Clock, 
  User, 
  Calendar, 
  Tag, 
  ArrowLeft,
  MessageCircle,
  Star,
  CheckCircle,
  X
} from 'lucide-react';
import { jobs, categories } from '../data/mockData';
import { formatBudget, formatDate, getExperienceColor, getLocationColor, getCategoryIcon } from '../utils/helpers';
import { useAuth } from '../contexts/AuthContext';

const JobDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [showProposalModal, setShowProposalModal] = useState(false);
  const [proposalData, setProposalData] = useState({
    message: '',
    bidAmount: '',
    estimatedTime: '',
  });
  const { user } = useAuth();
  
  // Find job by ID
  const job = jobs.find(j => j.id === id);
  
  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Job Not Found</h1>
          <Link to="/browse-jobs" className="text-blue-600 hover:text-blue-500">
            Back to Jobs
          </Link>
        </div>
      </div>
    );
  }

  const category = categories.find(c => c.id === job.category);

  const handleProposalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle proposal submission logic here
    console.log('Proposal submitted:', proposalData);
    setShowProposalModal(false);
    setProposalData({ message: '', bidAmount: '', estimatedTime: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <Link
            to="/browse-jobs"
            className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Jobs
          </Link>
        </motion.div>

        {/* Job Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 mb-8"
        >
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-4">
                {category && (
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                    {getCategoryIcon(category.name)}
                  </div>
                )}
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {job.title}
                  </h1>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                    <span>Posted by {job.client.name}</span>
                    <span>•</span>
                    <span>{formatDate(job.postedAt)}</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <DollarSign className="w-5 h-5 mr-2" />
                  <span className="font-medium">{formatBudget(job.budget)}</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <Clock className="w-5 h-5 mr-2" />
                  <span className="font-medium">{job.duration}</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span className={`font-medium ${getLocationColor(job.location)}`}>
                    {job.location}
                  </span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <User className="w-5 h-5 mr-2" />
                  <span className={`font-medium ${getExperienceColor(job.experience)}`}>
                    {job.experience}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  job.status === 'open' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                  job.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                  'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                }`}>
                  {job.status === 'open' && <CheckCircle className="w-4 h-4 mr-1" />}
                  {job.status}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {job.proposals} proposals received
                </span>
              </div>
            </div>
          </div>

          {/* Apply Button */}
          <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
            {user ? (
              <button
                onClick={() => setShowProposalModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors flex items-center"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Submit Proposal
              </button>
            ) : (
              <div className="text-center">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Please sign in to submit a proposal for this job
                </p>
                <Link
                  to="/login"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors inline-flex items-center"
                >
                  Sign In to Apply
                </Link>
              </div>
            )}
          </div>
        </motion.div>

        {/* Job Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Job Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Job Description
              </h2>
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                  {job.description}
                </p>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  We are looking for a skilled professional who can deliver high-quality results within the specified timeline. The ideal candidate should have a strong portfolio and proven experience in similar projects.
                </p>
              </div>
            </motion.div>

            {/* Required Skills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Required Skills
              </h2>
              <div className="flex flex-wrap gap-3">
                {job.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                  >
                    <Tag className="w-4 h-4 mr-2" />
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Project Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Project Details
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">Project Type:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{category?.name || 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">Experience Level:</span>
                  <span className={`font-medium ${getExperienceColor(job.experience)}`}>
                    {job.experience}
                  </span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">Location:</span>
                  <span className={`font-medium ${getLocationColor(job.location)}`}>
                    {job.location}
                  </span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <span className="text-gray-600 dark:text-gray-400">Timeline:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{job.duration}</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Client Information */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                About the Client
              </h3>
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {job.client.name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Member since {formatDate(job.client.memberSince)}
                  </p>
                </div>
              </div>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Jobs Posted:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{job.client.jobsPosted}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Hire Rate:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{job.client.hireRate}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Avg. Rating:</span>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                    <span className="font-medium text-gray-900 dark:text-white">{job.client.rating}</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Similar Jobs */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Similar Jobs
              </h3>
              <div className="space-y-3">
                {jobs
                  .filter(j => j.category === job.category && j.id !== job.id)
                  .slice(0, 3)
                  .map((similarJob) => (
                    <Link
                      key={similarJob.id}
                      to={`/job/${similarJob.id}`}
                      className="block p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <h4 className="font-medium text-gray-900 dark:text-white text-sm line-clamp-2 mb-2">
                        {similarJob.title}
                      </h4>
                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>{formatBudget(similarJob.budget)}</span>
                        <span>{similarJob.location}</span>
                      </div>
                    </Link>
                  ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Proposal Modal */}
      <AnimatePresence>
        {showProposalModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Submit Your Proposal
                  </h2>
                  <button
                    onClick={() => setShowProposalModal(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  {job.title}
                </p>
              </div>

              <form onSubmit={handleProposalSubmit} className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Your Proposal Message
                  </label>
                  <textarea
                    value={proposalData.message}
                    onChange={(e) => setProposalData({ ...proposalData, message: e.target.value })}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-vertical"
                    placeholder="Describe why you're the best fit for this job, your approach, and relevant experience..."
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Your Bid Amount
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="number"
                        value={proposalData.bidAmount}
                        onChange={(e) => setProposalData({ ...proposalData, bidAmount: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                        placeholder="0.00"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Estimated Time
                    </label>
                    <input
                      type="text"
                      value={proposalData.estimatedTime}
                      onChange={(e) => setProposalData({ ...proposalData, estimatedTime: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                      placeholder="e.g., 2 weeks"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    type="button"
                    onClick={() => setShowProposalModal(false)}
                    className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors"
                  >
                    Submit Proposal
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default JobDetailsPage;
