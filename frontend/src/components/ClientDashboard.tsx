import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, X, Clock, AlertCircle, Shield, Eye, Briefcase } from 'lucide-react';
import { Job } from '../data/mockData';
import { PostedJob } from '../services/JobService';
import { JobCompletion, JobCompletionService } from '../services/JobCompletionService';
import { JobService } from '../services/JobService';
import ClientApprovalModal from './ClientApprovalModal';

interface ClientDashboardProps {
  clientId: string;
}

const ClientDashboard: React.FC<ClientDashboardProps> = ({ clientId }) => {
  const [pendingCompletions, setPendingCompletions] = useState<JobCompletion[]>([]);
  const [postedJobs, setPostedJobs] = useState<PostedJob[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCompletion, setSelectedCompletion] = useState<JobCompletion | null>(null);
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  // Load pending completions and posted jobs for the client
  useEffect(() => {
    const loadClientData = async () => {
      try {
        setIsLoading(true);
        const [completions, jobs] = await Promise.all([
          JobCompletionService.getPendingCompletionsForClient(clientId),
          JobService.getJobsByClient(clientId)
        ]);
        setPendingCompletions(completions);
        setPostedJobs(jobs);
        console.log('Loaded client jobs:', jobs);
      } catch (error) {
        console.error('Failed to load client data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadClientData();
  }, [clientId]);

  const handleApprove = async (approvalData: any) => {
    try {
      await JobCompletionService.approveCompletion(approvalData);
      // Refresh the list
      const updatedCompletions = await JobCompletionService.getPendingCompletionsForClient(clientId);
      setPendingCompletions(updatedCompletions);
      setIsApprovalModalOpen(false);
    } catch (error) {
      console.error('Failed to approve completion:', error);
      throw error;
    }
  };

  const handleReject = async (rejectionData: any) => {
    try {
      await JobCompletionService.rejectCompletion(rejectionData);
      // Refresh the list
      const updatedCompletions = await JobCompletionService.getPendingCompletionsForClient(clientId);
      setPendingCompletions(updatedCompletions);
      setIsApprovalModalOpen(false);
    } catch (error) {
      console.error('Failed to reject completion:', error);
      throw error;
    }
  };

  const openApprovalModal = (completion: JobCompletion, job: Job) => {
    setSelectedCompletion(completion);
    setSelectedJob(job);
    setIsApprovalModalOpen(true);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  // Mock job data for demonstration (in real app, this would come from a job service)
  const getMockJob = (jobId: string): Job => ({
    id: jobId,
    title: `Job ${jobId}`,
    description: 'Sample job description for demonstration purposes.',
    budget: 1500,
    duration: '2 weeks',
    experience: 'intermediate',
    location: 'remote',
    category: 'web-development',
    skills: ['React', 'TypeScript', 'Node.js'],
    status: 'in-progress',
    postedAt: new Date(),
    requirements: 'Sample requirements for the job.',
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
            <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Client Dashboard
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Review and approve pending job completions
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                Pending Approvals
              </span>
            </div>
            <p className="text-2xl font-bold text-blue-900 dark:text-blue-100 mt-2">
              {pendingCompletions.length}
            </p>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              <span className="text-sm font-medium text-green-900 dark:text-green-100">
                Approved Jobs
              </span>
            </div>
            <p className="text-2xl font-bold text-green-900 dark:text-green-100 mt-2">
              0
            </p>
          </div>

          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <X className="w-5 h-5 text-red-600 dark:text-red-400" />
              <span className="text-sm font-medium text-red-900 dark:text-red-100">
                Rejected Jobs
              </span>
            </div>
            <p className="text-2xl font-bold text-red-900 dark:text-red-100 mt-2">
              0
            </p>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <Briefcase className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <span className="text-sm font-medium text-purple-900 dark:text-purple-100">
                Total Posted Jobs
              </span>
            </div>
            <p className="text-2xl font-bold text-purple-900 dark:text-purple-100 mt-2">
              {postedJobs.length}
            </p>
          </div>
        </div>
      </div>

      {/* Posted Jobs Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <Briefcase className="w-5 h-5 mr-2" />
                Your Posted Jobs
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Jobs you have posted and their current status
              </p>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {postedJobs.length} job{postedJobs.length !== 1 ? 's' : ''} posted
            </div>
          </div>
        </div>

        {postedJobs.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No jobs posted yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Jobs you post through the "Post a Job" page will appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {postedJobs.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
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

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Budget</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          ${typeof job.budget === 'number' ? job.budget : `${job.budget.min}-${job.budget.max}`}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Duration</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{job.duration}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Experience</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{job.experience}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Posted</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {new Date(job.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Skills:</p>
                      <div className="flex flex-wrap gap-1">
                        {job.skills.slice(0, 3).map((skill, skillIndex) => (
                          <span
                            key={skillIndex}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                          >
                            {skill}
                          </span>
                        ))}
                        {job.skills.length > 3 && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            +{job.skills.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Pending Completions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Pending Job Completions
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Review and approve completed jobs from freelancers
          </p>
        </div>

        {pendingCompletions.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No pending completions
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              All job completions have been reviewed or there are no pending submissions.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {pendingCompletions.map((completion) => {
              const job = getMockJob(completion.jobId);
              return (
                <motion.div
                  key={completion.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {job.title}
                        </h4>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                          <Clock className="w-3 h-3 mr-1" />
                          Pending Review
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                            Submitted:
                          </p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {formatDate(completion.submittedAt)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                            Deliverables:
                          </p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {completion.deliverables.length} items
                          </p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          Completion Notes:
                        </p>
                        <p className="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                          {completion.completionNotes}
                        </p>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          Deliverables:
                        </p>
                        <ul className="space-y-1">
                          {completion.deliverables.map((deliverable, index) => (
                            <li key={index} className="flex items-center space-x-2 text-sm">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              <span className="text-gray-900 dark:text-white">{deliverable}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="flex flex-col space-y-2 ml-4">
                      <button
                        onClick={() => openApprovalModal(completion, job)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Review</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Client Approval Modal */}
      {selectedCompletion && selectedJob && (
        <ClientApprovalModal
          isOpen={isApprovalModalOpen}
          onClose={() => setIsApprovalModalOpen(false)}
          job={selectedJob}
          completion={selectedCompletion}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
    </div>
  );
};

export default ClientDashboard;
