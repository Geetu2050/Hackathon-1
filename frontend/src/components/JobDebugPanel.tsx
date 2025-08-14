import React, { useState, useEffect } from 'react';
import { JobService } from '../services/JobService';
import { PostedJob } from '../services/JobService';

const JobDebugPanel: React.FC = () => {
  const [jobs, setJobs] = useState<PostedJob[]>([]);
  const [storageKey, setStorageKey] = useState('');

  const loadJobs = async () => {
    const allJobs = await JobService.getAllJobs();
    setJobs(allJobs);
    setStorageKey(JobService.getStorageKey());
  };

  const clearJobs = () => {
    JobService.clearAllJobs();
    loadJobs();
  };

  const addTestJob = async () => {
    const testJob = {
      title: 'Test Job - ' + new Date().toLocaleTimeString(),
      description: 'This is a test job created for debugging purposes.',
      budget: 1500,
      category: 'web-development',
      skills: ['React', 'TypeScript', 'Node.js'],
      experience: 'intermediate' as const,
      location: 'remote' as const,
      duration: '2 weeks',
      postedAt: new Date().toISOString().split('T')[0],
      clientId: 'client123',
      postedBy: 'Debug Client',
    };

    await JobService.postJob(testJob);
    loadJobs();
  };

  useEffect(() => {
    loadJobs();
  }, []);

  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-lg max-w-md z-50">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
        🐛 Job Debug Panel
      </h3>
      
      <div className="space-y-2 text-xs">
        <div>
          <span className="text-gray-600 dark:text-gray-400">Storage Key:</span>
          <span className="ml-2 font-mono text-gray-800 dark:text-gray-200">{storageKey}</span>
        </div>
        
        <div>
          <span className="text-gray-600 dark:text-gray-400">Total Jobs:</span>
          <span className="ml-2 font-bold text-blue-600">{jobs.length}</span>
        </div>
        
        <div className="space-y-1">
          {jobs.slice(0, 3).map((job, index) => (
            <div key={job.id} className="text-gray-700 dark:text-gray-300 truncate">
              {index + 1}. {job.title}
            </div>
          ))}
          {jobs.length > 3 && (
            <div className="text-gray-500">... and {jobs.length - 3} more</div>
          )}
        </div>
      </div>
      
      <div className="flex space-x-2 mt-3">
        <button
          onClick={addTestJob}
          className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
        >
          Add Test Job
        </button>
        <button
          onClick={clearJobs}
          className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
        >
          Clear All
        </button>
        <button
          onClick={loadJobs}
          className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
        >
          Refresh
        </button>
      </div>
    </div>
  );
};

export default JobDebugPanel;
