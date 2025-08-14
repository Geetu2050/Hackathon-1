import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, DollarSign, Clock, User, Calendar, Tag, CheckCircle, Eye } from 'lucide-react';
import { Job } from '../data/mockData';
import { formatBudget, formatDate, getExperienceColor, getLocationColor } from '../utils/helpers';
import JobCompletionModal from './JobCompletionModal';
import { JobCompletion, JobCompletionService } from '../services/JobCompletionService';

interface JobCardProps {
  job: Job;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const [isCompletionModalOpen, setIsCompletionModalOpen] = useState(false);
  const [completions, setCompletions] = useState<JobCompletion[]>([]);
  const [isLoadingCompletions, setIsLoadingCompletions] = useState(false);

  // Load job completions when component mounts
  useEffect(() => {
    const loadCompletions = async () => {
      try {
        setIsLoadingCompletions(true);
        const jobCompletions = await JobCompletionService.getJobCompletions(job.id);
        setCompletions(jobCompletions);
      } catch (error) {
        console.error('Failed to load completions:', error);
      } finally {
        setIsLoadingCompletions(false);
      }
    };

    loadCompletions();
  }, [job.id]);

  const handleCompleteJob = async (completionData: any) => {
    try {
      await JobCompletionService.submitCompletion(completionData);
      // Refresh completions after submission
      const updatedCompletions = await JobCompletionService.getJobCompletions(job.id);
      setCompletions(updatedCompletions);
    } catch (error) {
      console.error('Failed to submit completion:', error);
      throw error;
    }
  };

  const hasPendingCompletions = completions.some(c => c.status === 'pending');
  const hasApprovedCompletions = completions.some(c => c.status === 'approved');
  const hasRejectedCompletions = completions.some(c => c.status === 'rejected');

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2 flex-1 mr-4">
          {job.title}
        </h3>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${
          job.status === 'open' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
          job.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
          'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
        }`}>
          {job.status}
        </span>
      </div>
      
      {/* Description */}
      <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
        {job.description}
      </p>
      
      {/* Job Details */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <DollarSign className="w-4 h-4 mr-2" />
          <span className="font-medium">{formatBudget(job.budget)}</span>
        </div>
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <Clock className="w-4 h-4 mr-2" />
          <span className="font-medium">{job.duration}</span>
        </div>
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <MapPin className="w-4 h-4 mr-2" />
          <span className={`font-medium ${getLocationColor(job.location)}`}>
            {job.location}
          </span>
        </div>
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <User className="w-4 h-4 mr-2" />
          <span className={`font-medium ${getExperienceColor(job.experience)}`}>
            {job.experience}
          </span>
        </div>
      </div>
      
             {/* Skills */}
       <div className="mb-4">
         <div className="flex items-center mb-2">
           <Tag className="w-4 h-4 text-gray-400 mr-2" />
           <span className="text-sm text-gray-500 dark:text-gray-400">Required Skills:</span>
         </div>
         <div className="flex flex-wrap gap-2">
           {job.skills.slice(0, 4).map((skill, index) => (
             <span
               key={index}
               className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
             >
               {skill}
             </span>
           ))}
           {job.skills.length > 4 && (
             <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
               +{job.skills.length - 4} more
             </span>
           )}
         </div>
       </div>

       {/* Completion Status */}
       {completions.length > 0 && (
         <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
           <div className="flex items-center justify-between mb-2">
             <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Completion Status:</span>
             {isLoadingCompletions && (
               <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
             )}
           </div>
           
           <div className="flex flex-wrap gap-2">
             {hasPendingCompletions && (
               <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                 <Clock className="w-3 h-3 mr-1" />
                 Pending Approval
               </span>
             )}
             {hasApprovedCompletions && (
               <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                 <CheckCircle className="w-3 h-3 mr-1" />
                 Approved
               </span>
             )}
             {hasRejectedCompletions && (
               <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                 <Eye className="w-3 h-3 mr-1" />
                 Rejected
               </span>
             )}
           </div>
         </div>
       )}
      
             {/* Footer */}
       <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
         <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
           <Calendar className="w-4 h-4 mr-2" />
           <span>Posted {formatDate(job.postedAt)}</span>
         </div>
         
         <div className="flex items-center space-x-2">
           {/* Complete Job Button */}
           <button
             onClick={() => setIsCompletionModalOpen(true)}
             className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1"
           >
             <CheckCircle className="w-4 h-4" />
             <span>Complete</span>
           </button>
           
           <Link
             to={`/job/${job.id}`}
             className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
           >
             View Details
           </Link>
         </div>
       </div>

       {/* Job Completion Modal */}
       <JobCompletionModal
         isOpen={isCompletionModalOpen}
         onClose={() => setIsCompletionModalOpen(false)}
         job={job}
         onComplete={handleCompleteJob}
       />
    </div>
  );
};

export default JobCard;
