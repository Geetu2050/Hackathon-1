import React from 'react';
import { 
  Code, 
  Smartphone, 
  Palette, 
  PenTool, 
  TrendingUp, 
  Database, 
  Video, 
  HeadphonesIcon 
} from 'lucide-react';

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) {
    return '1 day ago';
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  } else {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }
};

export const formatBudget = (budget: number | { min: number; max: number }): string => {
  if (typeof budget === 'number') {
    return formatCurrency(budget);
  }
  return `${formatCurrency(budget.min)} - ${formatCurrency(budget.max)}`;
};

export const getCategoryIcon = (categoryName: string): React.ReactNode => {
  const iconMap: { [key: string]: React.ReactNode } = {
    'Web Development': <Code className="w-8 h-8 text-blue-600" />,
    'Mobile Development': <Smartphone className="w-8 h-8 text-green-600" />,
    'Design & Creative': <Palette className="w-8 h-8 text-purple-600" />,
    'Writing & Translation': <PenTool className="w-8 h-8 text-orange-600" />,
    'Digital Marketing': <TrendingUp className="w-8 h-8 text-red-600" />,
    'Data Science': <Database className="w-8 h-8 text-indigo-600" />,
    'Video & Animation': <Video className="w-8 h-8 text-pink-600" />,
    'Admin & Support': <HeadphonesIcon className="w-8 h-8 text-gray-600" />,
  };

  return iconMap[categoryName] || <Code className="w-8 h-8 text-gray-600" />;
};

export const getExperienceColor = (experience: string): string => {
  const colorMap: { [key: string]: string } = {
    'entry': 'text-green-600 dark:text-green-400',
    'intermediate': 'text-yellow-600 dark:text-yellow-400',
    'expert': 'text-red-600 dark:text-red-400',
  };
  return colorMap[experience] || 'text-gray-600 dark:text-gray-400';
};

export const getLocationColor = (location: string): string => {
  const colorMap: { [key: string]: string } = {
    'remote': 'text-blue-600 dark:text-blue-400',
    'onsite': 'text-purple-600 dark:text-purple-400',
    'hybrid': 'text-green-600 dark:text-green-400',
  };
  return colorMap[location] || 'text-gray-600 dark:text-gray-400';
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};
