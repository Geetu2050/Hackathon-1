import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, MapPin, DollarSign, Clock, Briefcase } from 'lucide-react';
import { jobs, categories } from '../data/mockData';
import { formatBudget, formatDate, getCategoryIcon } from '../utils/helpers';
import JobCard from '../components/JobCard';
import { useSearch } from '../contexts/SearchContext';

const BrowseJobsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { searchQuery: globalSearchQuery, setSearchQuery: setGlobalSearchQuery } = useSearch();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedExperience, setSelectedExperience] = useState(searchParams.get('experience') || '');
  const [selectedLocation, setSelectedLocation] = useState(searchParams.get('location') || '');
  const [selectedBudget, setSelectedBudget] = useState(searchParams.get('budget') || '');

  const experienceLevels = [
    { value: 'entry', label: 'Entry Level' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'expert', label: 'Expert' },
  ];

  const locations = [
    { value: 'remote', label: 'Remote' },
    { value: 'onsite', label: 'On-site' },
    { value: 'hybrid', label: 'Hybrid' },
  ];

  const budgetRanges = [
    { value: '0-1000', label: 'Under $1,000' },
    { value: '1000-5000', label: '$1,000 - $5,000' },
    { value: '5000-10000', label: '$5,000 - $10,000' },
    { value: '10000+', label: '$10,000+' },
  ];

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // Use global search query if available, otherwise use local search query
      const effectiveSearchQuery = globalSearchQuery || searchQuery;
      
      const matchesQuery = !effectiveSearchQuery || 
        job.title.toLowerCase().includes(effectiveSearchQuery.toLowerCase()) ||
        job.description.toLowerCase().includes(effectiveSearchQuery.toLowerCase()) ||
        job.skills.some(skill => skill.toLowerCase().includes(effectiveSearchQuery.toLowerCase()));

      const matchesCategory = !selectedCategory || job.category === selectedCategory;
      const matchesExperience = !selectedExperience || job.experience === selectedExperience;
      const matchesLocation = !selectedLocation || job.location === selectedLocation;

      const matchesBudget = !selectedBudget || (() => {
        const [min, max] = selectedBudget.split('-').map(Number);
        const jobBudget = typeof job.budget === 'number' ? job.budget : job.budget.max || job.budget.min;
        
        if (selectedBudget === '10000+') {
          return jobBudget >= 10000;
        }
        return jobBudget >= min && jobBudget <= (max || Infinity);
      })();

      return matchesQuery && matchesCategory && matchesExperience && matchesLocation && matchesBudget;
    });
  }, [globalSearchQuery, searchQuery, selectedCategory, selectedExperience, selectedLocation, selectedBudget]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (selectedCategory) params.set('category', selectedCategory);
    if (selectedExperience) params.set('experience', selectedExperience);
    if (selectedLocation) params.set('location', selectedLocation);
    if (selectedBudget) params.set('budget', selectedBudget);
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedExperience('');
    setSelectedLocation('');
    setSelectedBudget('');
    setSearchParams({});
  };

  const hasActiveFilters = selectedCategory || selectedExperience || selectedLocation || selectedBudget;

  // Sync global search with local search when navigating to this page
  useEffect(() => {
    if (globalSearchQuery && globalSearchQuery !== searchQuery) {
      setSearchQuery(globalSearchQuery);
      // Update URL params
      const params = new URLSearchParams(searchParams);
      params.set('q', globalSearchQuery);
      setSearchParams(params);
    }
  }, [globalSearchQuery, searchQuery, setSearchParams, searchParams]);

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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Browse Jobs
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Find the perfect freelance opportunity that matches your skills and goals
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search jobs, skills, or keywords..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>

            {/* Search Button */}
            <div className="flex items-center space-x-4">
              <button
                onClick={handleSearch}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
              >
                <Search className="w-5 h-5 mr-2" />
                Search Jobs
              </button>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Filter Options */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-4">
              <Filter className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-2" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filters:</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Experience Level
                </label>
                <select
                  value={selectedExperience}
                  onChange={(e) => setSelectedExperience(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">All Levels</option>
                  {experienceLevels.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Location Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Location
                </label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">All Locations</option>
                  {locations.map((location) => (
                    <option key={location.value} value={location.value}>
                      {location.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Budget Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Budget Range
                </label>
                <select
                  value={selectedBudget}
                  onChange={(e) => setSelectedBudget(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">All Budgets</option>
                  {budgetRanges.map((range) => (
                    <option key={range.value} value={range.value}>
                      {range.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-center justify-between mb-6"
        >
          <p className="text-gray-600 dark:text-gray-400">
            {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''} found
          </p>
          {hasActiveFilters && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">Active filters:</span>
              {selectedCategory && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {categories.find(c => c.id === selectedCategory)?.name}
                </span>
              )}
              {selectedExperience && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  {experienceLevels.find(e => e.value === selectedExperience)?.label}
                </span>
              )}
              {selectedLocation && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                  {locations.find(l => l.value === selectedLocation)?.label}
                </span>
              )}
            </div>
          )}
        </motion.div>

        {/* Job Listings */}
        {filteredJobs.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
            className="text-center py-16"
          >
            <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No jobs found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {searchQuery || hasActiveFilters 
                ? 'Try adjusting your search criteria or filters'
                : 'There are currently no jobs available'
              }
            </p>
            {searchQuery || hasActiveFilters ? (
              <button
                onClick={clearFilters}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Clear All Filters
              </button>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Check back later for new opportunities
              </p>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default BrowseJobsPage;
