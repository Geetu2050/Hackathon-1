import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, Clock, DollarSign, Star, Briefcase, Calendar, User, CheckCircle, Send } from 'lucide-react'
import { jobs } from '../data/mockData'
import { formatCurrency, formatDate, formatBudget, getCategoryIcon, getExperienceColor, getLocationColor } from '../utils/helpers'
import { useAuth } from '../contexts/AuthContext'

const JobDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const [showApplyForm, setShowApplyForm] = useState(false)
  const [proposal, setProposal] = useState('')
  const [bidAmount, setBidAmount] = useState('')
  const [estimatedTime, setEstimatedTime] = useState('')

  const job = jobs.find(j => j.id === id)

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Job Not Found</h1>
          <p className="text-gray-600 mb-6">The job you're looking for doesn't exist or has been removed.</p>
          <Link to="/jobs" className="btn-primary">
            Browse Other Jobs
          </Link>
        </div>
      </div>
    )
  }

  const handleSubmitProposal = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically submit the proposal to your backend
    console.log('Proposal submitted:', { proposal, bidAmount, estimatedTime })
    setShowApplyForm(false)
    // Show success message or redirect
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <Link
            to="/jobs"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 transition-colors"
          >
            ← Back to Jobs
          </Link>
        </motion.div>

        {/* Job Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8"
        >
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-4">
              <span className="text-4xl">{getCategoryIcon(job.category)}</span>
              <div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${job.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                  {job.status}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary-600">
                {formatBudget(job)}
              </div>
              <div className="text-gray-500 text-sm">
                Posted {formatDate(job.postedAt)}
              </div>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">{job.title}</h1>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="flex items-center space-x-2 text-gray-600">
              <MapPin className="w-5 h-5" />
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLocationColor(job.location)}`}>
                {job.location}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <Clock className="w-5 h-5" />
              <span>{job.duration}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <Briefcase className="w-5 h-5" />
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getExperienceColor(job.experience)}`}>
                {job.experience}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <DollarSign className="w-5 h-5" />
              <span>{job.budget.type === 'hourly' ? 'Hourly Rate' : 'Fixed Price'}</span>
            </div>
          </div>

          {/* Client Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-3">
              <img
                src={job.client.avatar}
                alt={job.client.name}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <h3 className="font-semibold text-gray-900">{job.client.name}</h3>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span>{job.client.rating}</span>
                  </div>
                  <span>•</span>
                  <span>{formatCurrency(job.client.totalSpent)} total spent</span>
                  <span>•</span>
                  <span>{job.proposals} proposals received</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            {user ? (
              <button
                onClick={() => setShowApplyForm(true)}
                className="btn-primary flex items-center justify-center space-x-2"
              >
                <Send className="w-5 h-5" />
                <span>Submit Proposal</span>
              </button>
            ) : (
              <Link
                to="/login"
                className="btn-primary flex items-center justify-center space-x-2"
              >
                <User className="w-5 h-5" />
                <span>Sign in to Apply</span>
              </Link>
            )}
            <button className="btn-outline flex items-center justify-center space-x-2">
              <CheckCircle className="w-5 h-5" />
              <span>Save Job</span>
            </button>
          </div>
        </motion.div>

        {/* Job Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Job Description</h2>
          <div className="prose max-w-none">
            <p className="text-gray-700 leading-relaxed mb-6">{job.description}</p>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Required Skills</h3>
            <div className="flex flex-wrap gap-2 mb-6">
              {job.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-2 bg-primary-100 text-primary-800 rounded-lg text-sm font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700">Duration: {job.duration}</span>
              </div>
              <div className="flex items-center space-x-3">
                <DollarSign className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700">Budget: {formatBudget(job)}</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700">Location: {job.location}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Briefcase className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700">Experience: {job.experience}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Apply Form Modal */}
        {showApplyForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowApplyForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Submit Your Proposal</h2>
                <button
                  onClick={() => setShowApplyForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmitProposal} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Proposal
                  </label>
                  <textarea
                    value={proposal}
                    onChange={(e) => setProposal(e.target.value)}
                    rows={6}
                    className="input-field"
                    placeholder="Describe your approach, relevant experience, and why you're the best fit for this project..."
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {job.budget.type === 'hourly' ? 'Hourly Rate' : 'Bid Amount'}
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                      <input
                        type="number"
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        className="input-field pl-8"
                        placeholder={job.budget.type === 'hourly' ? '50' : '5000'}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estimated Time
                    </label>
                    <input
                      type="text"
                      value={estimatedTime}
                      onChange={(e) => setEstimatedTime(e.target.value)}
                      className="input-field"
                      placeholder="e.g., 2 weeks, 40 hours"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowApplyForm(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    Submit Proposal
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default JobDetailsPage
