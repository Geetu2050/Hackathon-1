import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { createJob, CreateJobParams } from '../utils/aptosClient';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface SmartContractJobFormProps {
  onSuccess?: (txnHash: string) => void;
  onError?: (error: string) => void;
}

const validationSchema = Yup.object({
  freelancerAddress: Yup.string()
    .matches(/^0x[a-fA-F0-9]{10,}$/, 'Invalid Aptos address format (must start with 0x and be at least 12 characters)')
    .required('Freelancer address is required'),
  escrowAmount: Yup.number()
    .positive('Escrow amount must be positive')
    .min(0.001, 'Minimum escrow amount is 0.001 APT')
    .required('Escrow amount is required'),
  jobDescription: Yup.string()
    .min(10, 'Job description must be at least 10 characters')
    .max(1000, 'Job description must be less than 1000 characters')
    .required('Job description is required'),
});

const SmartContractJobForm: React.FC<SmartContractJobFormProps> = ({ 
  onSuccess, 
  onError 
}) => {
  const { account, connected } = useWallet();
  const [balance, setBalance] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch balance when account changes
  useEffect(() => {
    const fetchBalance = async () => {
      if (account?.address) {
        try {
          // For demo purposes, set a mock balance
          // In a real app, you would fetch the actual balance from the blockchain
          setBalance(10.0); // Mock balance of 10 APT
        } catch (error) {
          console.error('Error fetching balance:', error);
          setBalance(0);
        }
      }
    };

    fetchBalance();
  }, [account?.address]);
  const [txnHash, setTxnHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (values: {
    freelancerAddress: string;
    escrowAmount: number;
    jobDescription: string;
  }) => {
    if (!account || !connected) {
      setError('Please connect your wallet first');
      return;
    }

    if (values.escrowAmount > balance) {
      setError('Insufficient balance for escrow amount');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setTxnHash(null);

    try {
      const params: CreateJobParams = {
        freelancer: values.freelancerAddress,
        escrowAmount: values.escrowAmount,
        jobDescription: values.jobDescription,
      };

      const hash = await createJob(account, params);
      setTxnHash(hash);
      onSuccess?.(hash);
      
      console.log('Job created successfully:', hash);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create job';
      setError(errorMessage);
      onError?.(errorMessage);
      console.error('Error creating job:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!connected) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Wallet Not Connected
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Please connect your Aptos wallet to create jobs using the smart contract.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Create Job with Smart Contract
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Create a new freelance job using the Aptos blockchain. Funds will be held in escrow until the job is completed.
          </p>
        </div>

        {/* Wallet Info */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                Connected Wallet
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-300">
                {account?.address?.toString() || 'Not connected'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                Balance
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-300">
                {balance.toFixed(4)} APT
              </p>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {txnHash && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6"
          >
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              <div>
                <h3 className="text-sm font-medium text-green-800 dark:text-green-200">
                  Job Created Successfully!
                </h3>
                <p className="text-xs text-green-600 dark:text-green-300">
                  Transaction Hash: {txnHash.slice(0, 10)}...{txnHash.slice(-8)}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6"
          >
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
              <div>
                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                  Error Creating Job
                </h3>
                <p className="text-xs text-red-600 dark:text-red-300">
                  {error}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Job Creation Form */}
        <Formik
           initialValues={{
             freelancerAddress: '0xce68d218f90664f5555a8be27de361d964c06b789447d89e76fe9ae1d54f7c',
             escrowAmount: 2,
             jobDescription: 'Sample job description for testing the smart contract integration. This job involves developing a web application with React and TypeScript.',
           }}
           validationSchema={validationSchema}
           onSubmit={handleSubmit}
         >
          {({ values, errors, touched }) => (
            <Form className="space-y-6">
              {/* Freelancer Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Freelancer Address
                </label>
                <Field
                  type="text"
                  name="freelancerAddress"
                  placeholder="0x..."
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
                <ErrorMessage
                  name="freelancerAddress"
                  component="div"
                  className="mt-1 text-sm text-red-600 dark:text-red-400"
                />
              </div>

              {/* Escrow Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Escrow Amount (APT)
                </label>
                <Field
                  type="number"
                  name="escrowAmount"
                  step="0.001"
                  min="0.001"
                  max={balance}
                  placeholder="0.001"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
                <div className="mt-1 flex justify-between text-xs">
                  <span className="text-gray-500 dark:text-gray-400">
                    Available: {balance.toFixed(4)} APT
                  </span>
                  {errors.escrowAmount && touched.escrowAmount && (
                    <span className="text-red-600 dark:text-red-400">
                      {errors.escrowAmount}
                    </span>
                  )}
                </div>
              </div>

              {/* Job Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Job Description
                </label>
                <Field
                  as="textarea"
                  name="jobDescription"
                  rows={4}
                  placeholder="Describe the job requirements, deliverables, and timeline..."
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-vertical"
                />
                <ErrorMessage
                  name="jobDescription"
                  component="div"
                  className="mt-1 text-sm text-red-600 dark:text-red-400"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Creating Job...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    <span>Create Job with Smart Contract</span>
                  </>
                )}
              </button>

              {/* Info Text */}
              <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                <p>• Job will be created on the Aptos blockchain</p>
                <p>• Escrow amount will be held until job completion</p>
                <p>• Only you can approve job completion and release funds</p>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default SmartContractJobForm;
