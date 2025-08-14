import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, X, AlertCircle, Shield, Eye, EyeOff, Lock } from 'lucide-react';
import { Job } from '../data/mockData';

interface JobCompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: Job;
  onComplete: (completionData: JobCompletionData) => Promise<void>;
}

interface JobCompletionData {
  jobId: string;
  completionNotes: string;
  deliverables: string[];
  clientPassword: string;
  clientSignature: string;
}

const JobCompletionModal: React.FC<JobCompletionModalProps> = ({
  isOpen,
  onClose,
  job,
  onComplete,
}) => {
  const [step, setStep] = useState<'form' | 'authentication' | 'confirmation'>('form');
  const [completionNotes, setCompletionNotes] = useState('');
  const [deliverables, setDeliverables] = useState<string[]>(['']);
  const [clientPassword, setClientPassword] = useState('');
  const [clientSignature, setClientSignature] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAddDeliverable = () => {
    setDeliverables([...deliverables, '']);
  };

  const handleDeliverableChange = (index: number, value: string) => {
    const newDeliverables = [...deliverables];
    newDeliverables[index] = value;
    setDeliverables(newDeliverables);
  };

  const handleRemoveDeliverable = (index: number) => {
    if (deliverables.length > 1) {
      setDeliverables(deliverables.filter((_, i) => i !== index));
    }
  };

  const handleNext = () => {
    if (step === 'form') {
      if (!completionNotes.trim() || deliverables.some(d => !d.trim())) {
        setError('Please fill in all required fields');
        return;
      }
      setStep('authentication');
      setError('');
    } else if (step === 'authentication') {
      if (!clientPassword || !clientSignature) {
        setError('Please provide both password and signature');
        return;
      }
      setStep('confirmation');
      setError('');
    }
  };

  const handleBack = () => {
    if (step === 'authentication') {
      setStep('form');
    } else if (step === 'confirmation') {
      setStep('authentication');
    }
    setError('');
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const completionData: JobCompletionData = {
        jobId: job.id,
        completionNotes,
        deliverables: deliverables.filter(d => d.trim()),
        clientPassword,
        clientSignature,
      };

      await onComplete(completionData);
      setStep('confirmation');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to complete job');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setStep('form');
    setCompletionNotes('');
    setDeliverables(['']);
    setClientPassword('');
    setClientSignature('');
    setError('');
    setIsLoading(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
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
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Complete Job
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

            {/* Progress Steps */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className={`flex items-center space-x-2 ${step === 'form' ? 'text-blue-600' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step === 'form' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}>
                    1
                  </div>
                  <span className="text-sm font-medium">Job Details</span>
                </div>
                <div className={`flex items-center space-x-2 ${step === 'authentication' ? 'text-blue-600' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step === 'authentication' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}>
                    2
                  </div>
                  <span className="text-sm font-medium">Authentication</span>
                </div>
                <div className={`flex items-center space-x-2 ${step === 'confirmation' ? 'text-blue-600' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step === 'confirmation' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}>
                    3
                  </div>
                  <span className="text-sm font-medium">Confirmation</span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center space-x-3"
                >
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                  <span className="text-red-800 dark:text-red-200">{error}</span>
                </motion.div>
              )}

              {/* Step 1: Job Details */}
              {step === 'form' && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Completion Notes *
                    </label>
                    <textarea
                      value={completionNotes}
                      onChange={(e) => setCompletionNotes(e.target.value)}
                      placeholder="Describe the completed work, any challenges faced, and final deliverables..."
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Deliverables *
                    </label>
                    {deliverables.map((deliverable, index) => (
                      <div key={index} className="flex items-center space-x-2 mb-2">
                        <input
                          type="text"
                          value={deliverable}
                          onChange={(e) => handleDeliverableChange(index, e.target.value)}
                          placeholder={`Deliverable ${index + 1}`}
                          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                        />
                        {deliverables.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveDeliverable(index)}
                            className="p-2 text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={handleAddDeliverable}
                      className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                    >
                      + Add another deliverable
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Client Authentication */}
              {step === 'authentication' && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Client Authentication Required
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      To complete this job, the client must provide authentication credentials
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Client Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={clientPassword}
                        onChange={(e) => setClientPassword(e.target.value)}
                        placeholder="Enter client's password"
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                      />
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Client Digital Signature *
                    </label>
                    <input
                      type="text"
                      value={clientSignature}
                      onChange={(e) => setClientSignature(e.target.value)}
                      placeholder="Enter client's digital signature or approval code"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      This should be provided by the client to authorize job completion
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Confirmation */}
              {step === 'confirmation' && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="text-center space-y-6"
                >
                  <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      Job Completion Submitted!
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Your job completion request has been submitted and is pending client approval.
                      The client will review your work and approve the completion.
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-left">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Completion Summary:</h4>
                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      <li>• Job: {job.title}</li>
                      <li>• Deliverables: {deliverables.filter(d => d.trim()).length} items</li>
                      <li>• Status: Pending Client Approval</li>
                    </ul>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700">
              {step !== 'form' && (
                <button
                  onClick={handleBack}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Back
                </button>
              )}
              
              <div className="flex items-center space-x-3 ml-auto">
                {step === 'confirmation' ? (
                  <button
                    onClick={handleClose}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                  >
                    Close
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleClose}
                      className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={step === 'authentication' ? handleSubmit : handleNext}
                      disabled={isLoading}
                      className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors flex items-center space-x-2"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Processing...</span>
                        </>
                      ) : (
                        <span>{step === 'authentication' ? 'Submit Completion' : 'Next'}</span>
                      )}
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default JobCompletionModal;
