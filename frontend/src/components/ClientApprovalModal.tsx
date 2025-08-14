import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, X, AlertCircle, Shield, Eye, EyeOff, Lock, FileText, Clock, DollarSign } from 'lucide-react';
import { Job } from '../data/mockData';

interface JobCompletion {
  id: string;
  jobId: string;
  completionNotes: string;
  deliverables: string[];
  submittedAt: Date;
  status: 'pending' | 'approved' | 'rejected';
  clientFeedback?: string;
}

interface ClientApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: Job;
  completion: JobCompletion;
  onApprove: (approvalData: ApprovalData) => Promise<void>;
  onReject: (rejectionData: RejectionData) => Promise<void>;
}

interface ApprovalData {
  completionId: string;
  clientPassword: string;
  clientSignature: string;
  approvalNotes: string;
}

interface RejectionData {
  completionId: string;
  clientPassword: string;
  rejectionReason: string;
  feedback: string;
}

const ClientApprovalModal: React.FC<ClientApprovalModalProps> = ({
  isOpen,
  onClose,
  job,
  completion,
  onApprove,
  onReject,
}) => {
  const [action, setAction] = useState<'review' | 'approve' | 'reject'>('review');
  const [clientPassword, setClientPassword] = useState('');
  const [clientSignature, setClientSignature] = useState('');
  const [approvalNotes, setApprovalNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [feedback, setFeedback] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleApprove = async () => {
    if (!clientPassword || !clientSignature) {
      setError('Please provide both password and signature');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      
      const approvalData: ApprovalData = {
        completionId: completion.id,
        clientPassword,
        clientSignature,
        approvalNotes: approvalNotes.trim() || 'Job completed successfully',
      };

      await onApprove(approvalData);
      setAction('review');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to approve job');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async () => {
    if (!clientPassword || !rejectionReason.trim()) {
      setError('Please provide password and rejection reason');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      
      const rejectionData: RejectionData = {
        completionId: completion.id,
        clientPassword,
        rejectionReason: rejectionReason.trim(),
        feedback: feedback.trim(),
      };

      await onReject(rejectionData);
      setAction('review');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reject job');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setAction('review');
    setClientPassword('');
    setClientSignature('');
    setApprovalNotes('');
    setRejectionReason('');
    setFeedback('');
    setError('');
    setIsLoading(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Review Job Completion
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {job.title}
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center space-x-3"
                >
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                  <span className="text-red-800 dark:text-red-200">{error}</span>
                </motion.div>
              )}

              {/* Job Information */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-3">Job Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-400">Title:</span>
                      <span className="text-gray-900 dark:text-white font-medium">{job.title}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-400">Duration:</span>
                      <span className="text-gray-900 dark:text-white font-medium">{job.duration}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-400">Budget:</span>
                      <span className="text-gray-900 dark:text-white font-medium">
                        ${typeof job.budget === 'number' ? job.budget : job.budget.amount}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-3">Completion Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-400">Submitted:</span>
                      <span className="text-gray-900 dark:text-white font-medium">
                        {formatDate(completion.submittedAt)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-400">Status:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        completion.status === 'pending' 
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          : completion.status === 'approved'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {completion.status.charAt(0).toUpperCase() + completion.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Completion Notes */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 dark:text-white mb-3">Completion Notes</h3>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <p className="text-gray-700 dark:text-gray-300">{completion.completionNotes}</p>
                </div>
              </div>

              {/* Deliverables */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 dark:text-white mb-3">Deliverables</h3>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <ul className="space-y-2">
                    {completion.deliverables.map((deliverable, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-gray-700 dark:text-gray-300">{deliverable}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Buttons */}
              {completion.status === 'pending' && (
                <div className="flex items-center justify-center space-x-4 mb-6">
                  <button
                    onClick={() => setAction('approve')}
                    className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors flex items-center space-x-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    <span>Approve Completion</span>
                  </button>
                  <button
                    onClick={() => setAction('reject')}
                    className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors flex items-center space-x-2"
                  >
                    <X className="w-5 h-5" />
                    <span>Reject Completion</span>
                  </button>
                </div>
              )}

              {/* Approval Form */}
              {action === 'approve' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6"
                >
                  <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-4">Approve Job Completion</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                        Approval Notes (Optional)
                      </label>
                      <textarea
                        value={approvalNotes}
                        onChange={(e) => setApprovalNotes(e.target.value)}
                        placeholder="Add any additional notes about the approval..."
                        rows={3}
                        className="w-full px-4 py-3 border border-blue-300 dark:border-blue-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                        Client Password *
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={clientPassword}
                          onChange={(e) => setClientPassword(e.target.value)}
                          placeholder="Enter your password to confirm approval"
                          className="w-full pl-12 pr-4 py-3 border border-blue-300 dark:border-blue-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                        />
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-400" />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-400 hover:text-blue-600 dark:hover:text-blue-300"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                        Digital Signature *
                      </label>
                      <input
                        type="text"
                        value={clientSignature}
                        onChange={(e) => setClientSignature(e.target.value)}
                        placeholder="Enter your digital signature or approval code"
                        className="w-full px-4 py-3 border border-blue-300 dark:border-blue-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Rejection Form */}
              {action === 'reject' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6"
                >
                  <h3 className="font-medium text-red-900 dark:text-red-100 mb-4">Reject Job Completion</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-red-900 dark:text-red-100 mb-2">
                        Rejection Reason *
                      </label>
                      <input
                        type="text"
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="Brief reason for rejection..."
                        className="w-full px-4 py-3 border border-red-300 dark:border-red-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-red-900 dark:text-red-100 mb-2">
                        Detailed Feedback
                      </label>
                      <textarea
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        placeholder="Provide detailed feedback on what needs to be improved..."
                        rows={4}
                        className="w-full px-4 py-3 border border-red-300 dark:border-red-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-red-900 dark:text-red-100 mb-2">
                        Client Password *
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={clientPassword}
                          onChange={(e) => setClientPassword(e.target.value)}
                          placeholder="Enter your password to confirm rejection"
                          className="w-full pl-12 pr-4 py-3 border border-red-300 dark:border-red-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                        />
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-red-400" />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-400 hover:text-red-600 dark:hover:text-red-300"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Status Display */}
              {completion.status !== 'pending' && (
                <div className={`mt-6 p-4 rounded-lg ${
                  completion.status === 'approved' 
                    ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                    : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                }`}>
                  <h3 className={`font-medium mb-2 ${
                    completion.status === 'approved' 
                      ? 'text-green-900 dark:text-green-100'
                      : 'text-red-900 dark:text-red-100'
                  }`}>
                    {completion.status === 'approved' ? 'Job Approved' : 'Job Rejected'}
                  </h3>
                  {completion.clientFeedback && (
                    <p className={`text-sm ${
                      completion.status === 'approved' 
                        ? 'text-green-700 dark:text-green-200'
                        : 'text-red-700 dark:text-red-200'
                    }`}>
                      {completion.clientFeedback}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setAction('review')}
                className={`px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors ${
                  action === 'review' ? 'hidden' : ''
                }`}
              >
                Back to Review
              </button>
              
              <div className="flex items-center space-x-3 ml-auto">
                {action === 'approve' ? (
                  <button
                    onClick={handleApprove}
                    disabled={isLoading}
                    className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium rounded-lg transition-colors flex items-center space-x-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Approving...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        <span>Approve Job</span>
                      </>
                    )}
                  </button>
                ) : action === 'reject' ? (
                  <button
                    onClick={handleReject}
                    disabled={isLoading}
                    className="px-6 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-medium rounded-lg transition-colors flex items-center space-x-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Rejecting...</span>
                      </>
                    ) : (
                      <>
                        <X className="w-5 h-5" />
                        <span>Reject Job</span>
                      </>
                    )}
                  </button>
                ) : null}
                
                <button
                  onClick={handleClose}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ClientApprovalModal;
