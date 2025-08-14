import React, { createContext, useContext, useState, useMemo } from 'react';
import { Job, Freelancer } from '../data/mockData';

interface SearchContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchFilters: SearchFilters;
  setSearchFilters: (filters: SearchFilters) => void;
  searchJobs: (jobs: Job[]) => Job[];
  searchFreelancers: (freelancers: Freelancer[]) => Freelancer[];
  clearSearch: () => void;
}

interface SearchFilters {
  category: string;
  budget: {
    min: number;
    max: number;
  };
  experience: string;
  location: string;
  skills: string[];
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};

interface SearchProviderProps {
  children: React.ReactNode;
}

export const SearchProvider: React.FC<SearchProviderProps> = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    category: '',
    budget: { min: 0, max: 10000 },
    experience: '',
    location: '',
    skills: [],
  });

  const searchJobs = useMemo(() => {
    return (jobs: Job[]) => {
      return jobs.filter((job) => {
        // Text search
        const matchesQuery = !searchQuery || 
          job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.requirements.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));

        // Category filter
        const matchesCategory = !searchFilters.category || job.category === searchFilters.category;

        // Budget filter
        const jobBudget = typeof job.budget === 'number' ? job.budget : job.budget.amount;
        const matchesBudget = jobBudget >= searchFilters.budget.min && 
                            (searchFilters.budget.max === 0 || jobBudget <= searchFilters.budget.max);

        // Experience filter
        const matchesExperience = !searchFilters.experience || job.experience === searchFilters.experience;

        // Location filter
        const matchesLocation = !searchFilters.location || job.location === searchFilters.location;

        // Skills filter
        const matchesSkills = searchFilters.skills.length === 0 || 
          searchFilters.skills.some(skill => job.skills.includes(skill));

        return matchesQuery && matchesCategory && matchesBudget && 
               matchesExperience && matchesLocation && matchesSkills;
      });
    };
  }, [searchQuery, searchFilters]);

  const searchFreelancers = useMemo(() => {
    return (freelancers: Freelancer[]) => {
      return freelancers.filter((freelancer) => {
        // Text search
        const matchesQuery = !searchQuery || 
          freelancer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          freelancer.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          freelancer.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
          freelancer.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));

        // Experience filter
        const matchesExperience = !searchFilters.experience || freelancer.experience === searchFilters.experience;

        // Location filter
        const matchesLocation = !searchFilters.location || freelancer.location === searchFilters.location;

        // Skills filter
        const matchesSkills = searchFilters.skills.length === 0 || 
          searchFilters.skills.some(skill => freelancer.skills.includes(skill));

        return matchesQuery && matchesExperience && matchesLocation && matchesSkills;
      });
    };
  }, [searchQuery, searchFilters]);

  const clearSearch = () => {
    setSearchQuery('');
    setSearchFilters({
      category: '',
      budget: { min: 0, max: 10000 },
      experience: '',
      location: '',
      skills: [],
    });
  };

  const value: SearchContextType = {
    searchQuery,
    setSearchQuery,
    searchFilters,
    setSearchFilters,
    searchJobs,
    searchFreelancers,
    clearSearch,
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
};
