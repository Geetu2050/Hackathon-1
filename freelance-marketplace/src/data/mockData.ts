export interface Job {
  id: string
  title: string
  description: string
  category: string
  budget: {
    min: number
    max: number
    type: 'fixed' | 'hourly'
  }
  skills: string[]
  client: {
    id: string
    name: string
    avatar?: string
    rating: number
    totalSpent: number
  }
  postedAt: string
  proposals: number
  location: 'remote' | 'onsite' | 'hybrid'
  experience: 'entry' | 'intermediate' | 'expert'
  duration: string
  status: 'open' | 'in-progress' | 'completed'
}

export interface Freelancer {
  id: string
  name: string
  title: string
  avatar: string
  rating: number
  totalEarnings: number
  hourlyRate: number
  skills: string[]
  portfolio: PortfolioItem[]
  reviews: Review[]
  location: string
  availability: 'available' | 'busy' | 'unavailable'
  joinedAt: string
  completedJobs: number
  successRate: number
}

export interface PortfolioItem {
  id: string
  title: string
  description: string
  imageUrl: string
  technologies: string[]
  projectUrl?: string
}

export interface Review {
  id: string
  clientName: string
  rating: number
  comment: string
  date: string
}

export interface Category {
  id: string
  name: string
  icon: string
  jobCount: number
}

export const categories: Category[] = [
  { id: 'web-development', name: 'Web Development', icon: '💻', jobCount: 1247 },
  { id: 'mobile-development', name: 'Mobile Development', icon: '📱', jobCount: 892 },
  { id: 'design', name: 'Design & Creative', icon: '🎨', jobCount: 1563 },
  { id: 'writing', name: 'Writing & Translation', icon: '✍️', jobCount: 743 },
  { id: 'marketing', name: 'Digital Marketing', icon: '📈', jobCount: 567 },
  { id: 'data-science', name: 'Data Science', icon: '📊', jobCount: 234 },
  { id: 'video', name: 'Video & Animation', icon: '🎬', jobCount: 445 },
  { id: 'business', name: 'Business & Consulting', icon: '💼', jobCount: 678 }
]

export const jobs: Job[] = [
  {
    id: '1',
    title: 'Full-Stack Web Developer for E-commerce Platform',
    description: 'We need a skilled full-stack developer to build a modern e-commerce platform using React, Node.js, and MongoDB. The platform should include user authentication, product management, shopping cart, payment integration, and admin dashboard.',
    category: 'web-development',
    budget: { min: 5000, max: 15000, type: 'fixed' },
    skills: ['React', 'Node.js', 'MongoDB', 'Express', 'TypeScript', 'Stripe'],
    client: {
      id: 'client1',
      name: 'TechStart Inc.',
      avatar: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=150&h=150&fit=crop&crop=face',
      rating: 4.8,
      totalSpent: 45000
    },
    postedAt: '2024-01-15T10:30:00Z',
    proposals: 23,
    location: 'remote',
    experience: 'expert',
    duration: '3-4 months',
    status: 'open'
  },
  {
    id: '2',
    title: 'UI/UX Designer for Mobile App',
    description: 'Looking for a talented UI/UX designer to create beautiful and intuitive designs for our fitness tracking mobile app. Must have experience with Figma, mobile-first design, and user research.',
    category: 'design',
    budget: { min: 3000, max: 8000, type: 'fixed' },
    skills: ['Figma', 'UI/UX Design', 'Mobile Design', 'User Research', 'Prototyping'],
    client: {
      id: 'client2',
      name: 'FitLife Solutions',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      rating: 4.6,
      totalSpent: 28000
    },
    postedAt: '2024-01-14T14:20:00Z',
    proposals: 18,
    location: 'remote',
    experience: 'intermediate',
    duration: '6-8 weeks',
    status: 'open'
  },
  {
    id: '3',
    title: 'Content Writer for Tech Blog',
    description: 'We need a skilled content writer to create engaging articles about technology trends, software development, and industry insights. Must have experience in tech writing and SEO optimization.',
    category: 'writing',
    budget: { min: 25, max: 50, type: 'hourly' },
    skills: ['Content Writing', 'SEO', 'Technology', 'Research', 'Editing'],
    client: {
      id: 'client3',
      name: 'TechBlog Media',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      rating: 4.9,
      totalSpent: 12000
    },
    postedAt: '2024-01-13T09:15:00Z',
    proposals: 31,
    location: 'remote',
    experience: 'intermediate',
    duration: 'Ongoing',
    status: 'open'
  },
  {
    id: '4',
    title: 'React Native Developer for Cross-Platform App',
    description: 'Seeking an experienced React Native developer to build a cross-platform mobile app for both iOS and Android. The app will handle real-time data synchronization and offline functionality.',
    category: 'mobile-development',
    budget: { min: 8000, max: 20000, type: 'fixed' },
    skills: ['React Native', 'JavaScript', 'Redux', 'Firebase', 'Offline Storage'],
    client: {
      id: 'client4',
      name: 'InnovateCorp',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face',
      rating: 4.7,
      totalSpent: 67000
    },
    postedAt: '2024-01-12T16:45:00Z',
    proposals: 15,
    location: 'hybrid',
    experience: 'expert',
    duration: '4-5 months',
    status: 'open'
  },
  {
    id: '5',
    title: 'Digital Marketing Specialist',
    description: 'Need a digital marketing expert to manage our social media presence, run PPC campaigns, and improve our online visibility. Experience with Google Ads, Facebook Ads, and analytics tools required.',
    category: 'marketing',
    budget: { min: 40, max: 80, type: 'hourly' },
    skills: ['Digital Marketing', 'Google Ads', 'Facebook Ads', 'Analytics', 'SEO', 'Social Media'],
    client: {
      id: 'client5',
      name: 'Growth Marketing Co.',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face',
      rating: 4.5,
      totalSpent: 34000
    },
    postedAt: '2024-01-11T11:30:00Z',
    proposals: 27,
    location: 'remote',
    experience: 'intermediate',
    duration: '3 months',
    status: 'open'
  }
]

export const freelancers: Freelancer[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    title: 'Senior Full-Stack Developer',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    rating: 4.9,
    totalEarnings: 125000,
    hourlyRate: 75,
    skills: ['React', 'Node.js', 'Python', 'AWS', 'Docker', 'TypeScript'],
    portfolio: [
      {
        id: 'p1',
        title: 'E-commerce Platform',
        description: 'Built a scalable e-commerce platform serving 10k+ users',
        imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop',
        technologies: ['React', 'Node.js', 'MongoDB'],
        projectUrl: 'https://example.com'
      }
    ],
    reviews: [
      {
        id: 'r1',
        clientName: 'John Smith',
        rating: 5,
        comment: 'Excellent work! Sarah delivered beyond expectations.',
        date: '2024-01-10'
      }
    ],
    location: 'San Francisco, CA',
    availability: 'available',
    joinedAt: '2022-03-15',
    completedJobs: 47,
    successRate: 98
  },
  {
    id: '2',
    name: 'Michael Chen',
    title: 'UI/UX Designer & Product Manager',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    rating: 4.8,
    totalEarnings: 89000,
    hourlyRate: 65,
    skills: ['Figma', 'Sketch', 'Adobe Creative Suite', 'User Research', 'Prototyping'],
    portfolio: [
      {
        id: 'p2',
        title: 'Fitness App Design',
        description: 'Complete UI/UX design for a fitness tracking application',
        imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
        technologies: ['Figma', 'Prototyping', 'User Research']
      }
    ],
    reviews: [
      {
        id: 'r2',
        clientName: 'Lisa Wang',
        rating: 5,
        comment: 'Michael is incredibly talented and professional.',
        date: '2024-01-08'
      }
    ],
    location: 'New York, NY',
    availability: 'busy',
    joinedAt: '2021-11-20',
    completedJobs: 34,
    successRate: 95
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    title: 'Content Writer & SEO Specialist',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    rating: 4.7,
    totalEarnings: 56000,
    hourlyRate: 45,
    skills: ['Content Writing', 'SEO', 'Copywriting', 'Research', 'Editing'],
    portfolio: [
      {
        id: 'p3',
        title: 'Tech Blog Series',
        description: 'Wrote 50+ articles for a major tech publication',
        imageUrl: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=300&fit=crop',
        technologies: ['Content Writing', 'SEO', 'Research']
      }
    ],
    reviews: [
      {
        id: 'r3',
        clientName: 'David Kim',
        rating: 4,
        comment: 'Great writer with strong SEO knowledge.',
        date: '2024-01-05'
      }
    ],
    location: 'Austin, TX',
    availability: 'available',
    joinedAt: '2023-01-10',
    completedJobs: 28,
    successRate: 92
  }
]
