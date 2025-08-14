import { Job } from '../data/mockData'

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
  
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  })
}

export const formatBudget = (job: Job): string => {
  if (job.budget.type === 'hourly') {
    return `${formatCurrency(job.budget.min)} - ${formatCurrency(job.budget.max)}/hr`
  }
  return `${formatCurrency(job.budget.min)} - ${formatCurrency(job.budget.max)}`
}

export const getCategoryIcon = (categoryId: string): string => {
  const icons: Record<string, string> = {
    'web-development': '💻',
    'mobile-development': '📱',
    'design': '🎨',
    'writing': '✍️',
    'marketing': '📈',
    'data-science': '📊',
    'video': '🎬',
    'business': '💼'
  }
  return icons[categoryId] || '📋'
}

export const getExperienceColor = (experience: string): string => {
  const colors: Record<string, string> = {
    'entry': 'bg-green-100 text-green-800',
    'intermediate': 'bg-yellow-100 text-yellow-800',
    'expert': 'bg-red-100 text-red-800'
  }
  return colors[experience] || 'bg-gray-100 text-gray-800'
}

export const getLocationColor = (location: string): string => {
  const colors: Record<string, string> = {
    'remote': 'bg-blue-100 text-blue-800',
    'onsite': 'bg-purple-100 text-purple-800',
    'hybrid': 'bg-orange-100 text-orange-800'
  }
  return colors[location] || 'bg-gray-100 text-gray-800'
}

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}
