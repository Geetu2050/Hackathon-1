import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, Filter, MapPin, Clock, DollarSign, Star } from 'lucide-react'
import { jobs, categories } from '../data/mockData'
import { formatCurrency, formatDate, formatBudget, getCategoryIcon, getExperienceColor, getLocationColor } from '../utils/helpers'
import JobCard from '../components/JobCard'

const BrowseJobsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [filteredJobs, setFilteredJobs] = useState(jobs)
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '')
  const [selectedExperience, setSelectedExperience] = useState(searchParams.get('experience') || '')
  const [selectedLocation, setSelectedLocation] = useState(searchParams.get('location') || '')
  const [selectedBudget, setSelectedBudget] = useState(searchParams.get('budget') || '')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    let filtered = jobs

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(job => job.category === selectedCategory)
    }

    // Experience filter
    if (selectedExperience) {
      filtered = filtered.filter(job => job.experience === selectedExperience)
    }

    // Location filter
    if (selectedLocation) {
      filtered = filtered.filter(job => job.location === selectedLocation)
    }

    // Budget filter
    if (selectedBudget) {
      filtered = filtered.filter(job => {
        const avgBudget = (job.budget.min + job.budget.max) / 2
        switch (selectedBudget) {
          case '0-1000':
            return avgBudget <= 1000
          case '1000-5000':
            return avgBudget > 1000 && avgBudget <= 5000
          case '5000-10000':
            return avgBudget > 5000 && avgBudget <= 10000
          case '10000+':
            return avgBudget > 10000
          default:
            return true
        }
      })
    }

    setFilteredJobs(filtered)

    // Update URL params
    const params = new URLSearchParams()
    if (searchQuery) params.set('search', searchQuery)
    if (selectedCategory) params.set('category', selectedCategory)
    if (selectedExperience) params.set('experience', selectedExperience)
    if (selectedLocation) params.set('location', selectedLocation)
    if (selectedBudget) params.set('budget', selectedBudget)
    setSearchParams(params)
  }, [searchQuery, selectedCategory, selectedExperience, selectedLocation, selectedBudget, setSearchParams])

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedCategory('')
    setSelectedExperience('')
    setSelectedLocation('')
    setSelectedBudget('')
    setSearchParams({})
  }

  const hasActiveFilters = searchQuery || selectedCategory || selectedExperience || selectedLocation || selectedBudget

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Jobs</h1>
          <p className="text-gray-600">
            Find the perfect freelance opportunity that matches your skills and experience
          </p>
        </motion.div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search jobs, skills, or companies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filter Toggle */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors"
            >
              <Filter className="w-5 h-5" />
              <span>Filters</span>
            </button>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                Clear all filters
              </button>
            )}
          </div>

          {/* Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 pt-4 border-t border-gray-200"
            >
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Experience Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
                <select
                  value={selectedExperience}
                  onChange={(e) => setSelectedExperience(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">All Levels</option>
                  <option value="entry">Entry Level</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="expert">Expert</option>
                </select>
              </div>

              {/* Location Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">All Locations</option>
                  <option value="remote">Remote</option>
                  <option value="onsite">On-site</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>

              {/* Budget Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Budget</label>
                <select
                  value={selectedBudget}
                  onChange={(e) => setSelectedBudget(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">All Budgets</option>
                  <option value="0-1000">$0 - $1,000</option>
                  <option value="1000-5000">$1,000 - $5,000</option>
                  <option value="5000-10000">$5,000 - $10,000</option>
                  <option value="10000+">$10,000+</option>
                </select>
              </div>

              {/* Sort Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="budget-high">Highest Budget</option>
                  <option value="budget-low">Lowest Budget</option>
                </select>
              </div>
            </motion.div>
          )}
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            Showing <span className="font-semibold">{filteredJobs.length}</span> jobs
            {hasActiveFilters && ' matching your criteria'}
          </p>
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2">
              {searchQuery && (
                <span className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm">
                  Search: "{searchQuery}"
                </span>
              )}
              {selectedCategory && (
                <span className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm">
                  Category: {categories.find(c => c.id === selectedCategory)?.name}
                </span>
              )}
              {selectedExperience && (
                <span className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm">
                  Experience: {selectedExperience}
                </span>
              )}
              {selectedLocation && (
                <span className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm">
                  Location: {selectedLocation}
                </span>
              )}
              {selectedBudget && (
                <span className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm">
                  Budget: {selectedBudget}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Job Listings */}
        {filteredJobs.length > 0 ? (
          <div className="space-y-4">
            {filteredJobs.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <JobCard job={job} />
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center py-12"
          >
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No jobs found</h3>
            <p className="text-gray-600 mb-6">
              {hasActiveFilters 
                ? "Try adjusting your filters or search terms"
                : "There are currently no jobs available"
              }
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="btn-primary"
              >
                Clear Filters
              </button>
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default BrowseJobsPage
