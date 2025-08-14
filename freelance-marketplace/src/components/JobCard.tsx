import React from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Clock, DollarSign, Star, Briefcase } from 'lucide-react'
import { Job } from '../data/mockData'
import { formatCurrency, formatDate, formatBudget, getCategoryIcon, getExperienceColor, getLocationColor } from '../utils/helpers'

interface JobCardProps {
  job: Job
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{getCategoryIcon(job.category)}</span>
          <div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${job.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
              {job.status}
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-primary-600 font-semibold text-lg">
            {formatBudget(job)}
          </div>
          <div className="text-gray-500 text-sm">
            {formatDate(job.postedAt)}
          </div>
        </div>
      </div>

      <Link to={`/jobs/${job.id}`} className="block">
        <h3 className="font-semibold text-gray-900 text-lg mb-3 hover:text-primary-600 transition-colors line-clamp-2">
          {job.title}
        </h3>
      </Link>

      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
        {job.description}
      </p>

      {/* Skills */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {job.skills.slice(0, 5).map((skill) => (
            <span
              key={skill}
              className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
            >
              {skill}
            </span>
          ))}
          {job.skills.length > 5 && (
            <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
              +{job.skills.length - 5} more
            </span>
          )}
        </div>
      </div>

      {/* Job Details */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <MapPin className="w-4 h-4" />
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLocationColor(job.location)}`}>
            {job.location}
          </span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Clock className="w-4 h-4" />
          <span>{job.duration}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Briefcase className="w-4 h-4" />
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getExperienceColor(job.experience)}`}>
            {job.experience}
          </span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <DollarSign className="w-4 h-4" />
          <span>{job.budget.type === 'hourly' ? 'Hourly' : 'Fixed'}</span>
        </div>
      </div>

      {/* Client Info and Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <img
            src={job.client.avatar}
            alt={job.client.name}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <div className="font-medium text-gray-900">{job.client.name}</div>
            <div className="flex items-center space-x-1 text-sm text-gray-600">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span>{job.client.rating}</span>
              <span>•</span>
              <span>{formatCurrency(job.client.totalSpent)} spent</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <span className="text-sm text-gray-500">
            {job.proposals} proposals
          </span>
          <Link
            to={`/jobs/${job.id}`}
            className="btn-primary"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  )
}

export default JobCard
