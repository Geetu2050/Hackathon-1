import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, CheckCircle, X, Lock, Eye, EyeOff, AlertTriangle, Briefcase, Plus } from 'lucide-react';
import { Job } from '../data/mockData';
import { PostedJob } from '../services/JobService';
import JobCompletionModal from '../components/JobCompletionModal';
import ClientDashboard from '../components/ClientDashboard';
import JobDebugPanel from '../components/JobDebugPanel';
import { JobService } from '../services/JobService';

const AuthenticationDemoPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'freelancer' | 'client'>('freelancer');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isCompletionModalOpen, setIsCompletionModalOpen] = useState(false);
  const [postedJobs, setPostedJobs] = useState<PostedJob[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load posted jobs on component mount and when tab changes
  useEffect(() => {
    const loadPostedJobs = async () => {
      setIsLoading(true);
      try {
        const jobs = await JobService.getAllJobs();
        setPostedJobs(jobs);
        console.log('Loaded posted jobs:', jobs);
      } catch (error) {
        console.error('Failed to load posted jobs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPostedJobs();
  }, [activeTab]); // Reload when tab changes

  // Mock job for demonstration (fallback if no jobs are posted)
  const demoJob: Job = {
    id: 'demo-job-1',
    title: 'Build a React E-commerce Website',
    description: 'Create a modern, responsive e-commerce website using React, TypeScript, and Tailwind CSS. The website should include product listings, shopping cart, user authentication, and payment integration.',
    budget: 2500,
    duration: '3 weeks',
    experience: 'intermediate',
    location: 'remote',
    category: 'web-development',
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'MongoDB'],
    status: 'in-progress',
    postedAt: new Date('2024-01-15'),
    requirements: 'Experience with React hooks, state management, and API integration. Knowledge of modern CSS frameworks and responsive design principles.',
  };

  const openCompletionModal = (job: Job) => {
    setSelectedJob(job);
    setIsCompletionModalOpen(true);
  };

  const handleCompleteJob = async (completionData: any) => {
    console.log('Job completion submitted:', completionData);
    // In a real app, this would call the service
    alert('Job completion submitted successfully! Check the client dashboard to see the pending approval.');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-10 h-10 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Client-Side Authentication Demo
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Experience the secure job completion workflow with client authentication and approval system
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8"
        >
          <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('freelancer')}
              className={`flex-1 py-3 px-6 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'freelancer'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <CheckCircle className="w-4 h-4 inline mr-2" />
              Freelancer View
            </button>
            <button
              onClick={() => setActiveTab('client')}
              className={`flex-1 py-3 px-6 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'client'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Shield className="w-4 h-4 inline mr-2" />
              Client View
            </button>
          </div>
        </motion.div>

        {/* Demo Content */}
        {activeTab === 'freelancer' ? (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Freelancer Instructions */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-4">
                🚀 Freelancer Workflow
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-blue-600 dark:text-blue-400 font-bold text-lg">1</span>
                  </div>
                  <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Complete Work</h3>
                  <p className="text-sm text-blue-700 dark:text-blue-200">
                    Finish the job and prepare deliverables
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-blue-600 dark:text-blue-400 font-bold text-lg">2</span>
                  </div>
                  <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Submit Completion</h3>
                  <p className="text-sm text-blue-700 dark:text-blue-200">
                    Use client credentials to submit completion
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-blue-600 dark:text-blue-400 font-bold text-lg">3</span>
                  </div>
                  <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Wait for Approval</h3>
                  <p className="text-sm text-blue-700 dark:text-blue-200">
                    Client reviews and approves the work
                  </p>
                </div>
              </div>
            </div>

            {/* Posted Jobs Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                  <Briefcase className="w-5 h-5 mr-2" />
                  Posted Jobs Available for Completion
                </h3>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {postedJobs.length} job{postedJobs.length !== 1 ? 's' : ''} available
                </div>
              </div>

              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-500 dark:text-gray-400 mt-2">Loading jobs...</p>
                </div>
              ) : postedJobs.length > 0 ? (
                <div className="space-y-4">
                  {postedJobs.map((job, index) => (
                    <motion.div
                      key={job.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {job.title}
                        </h4>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          job.status === 'open' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : job.status === 'in-progress'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        }`}>
                          {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                        {job.description}
                      </p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                        <div className="text-center">
                          <p className="text-xs text-gray-500 dark:text-gray-400">Budget</p>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            ${typeof job.budget === 'number' ? job.budget : `${job.budget.min}-${job.budget.max}`}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-500 dark:text-gray-400">Duration</p>
                          <p className="font-semibold text-gray-900 dark:text-white">{job.duration}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-500 dark:text-gray-400">Experience</p>
                          <p className="font-semibold text-gray-900 dark:text-white">{job.experience}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-500 dark:text-gray-400">Location</p>
                          <p className="font-semibold text-gray-900 dark:text-white">{job.location}</p>
                        </div>
                      </div>

                      <div className="text-center">
                        <button
                          onClick={() => openCompletionModal(job)}
                          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center mx-auto space-x-2"
                        >
                          <CheckCircle className="w-4 h-4" />
                          <span>Complete This Job</span>
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    No Jobs Posted Yet
                  </h4>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    Jobs posted through the "Post a Job" page will appear here for completion.
                  </p>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                    <h5 className="font-medium text-gray-900 dark:text-white mb-2">Demo Job Available</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      You can still test the completion workflow with the demo job below.
                    </p>
                    <button
                      onClick={() => openCompletionModal(demoJob)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center mx-auto space-x-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Try Demo Job</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Authentication Info */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-6 h-6 text-yellow-600 dark:text-yellow-400 mt-1" />
                <div>
                  <h3 className="font-medium text-yellow-900 dark:text-yellow-100 mb-2">
                    Demo Credentials
                  </h3>
                  <p className="text-sm text-yellow-700 dark:text-yellow-200 mb-3">
                    Use these mock credentials to test the authentication system:
                  </p>
                  <div className="bg-white dark:bg-gray-700 rounded-lg p-4 space-y-2">
                    <div className="flex items-center space-x-2">
                      <Lock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-mono text-gray-700 dark:text-gray-300">
                        Password: securePassword123
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-mono text-gray-700 dark:text-gray-300">
                        Signature: client123_signature_2024
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <ClientDashboard clientId="client123" />
          </motion.div>
        )}
      </div>

      {/* Job Completion Modal */}
      {selectedJob && (
        <JobCompletionModal
          isOpen={isCompletionModalOpen}
          onClose={() => setIsCompletionModalOpen(false)}
          job={selectedJob}
          onComplete={handleCompleteJob}
        />
      )}

      {/* Debug Panel - Remove this in production */}
      <JobDebugPanel />
    </div>
  );
};

export default AuthenticationDemoPage;
