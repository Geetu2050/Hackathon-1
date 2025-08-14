export interface Job {
  id: string;
  title: string;
  description: string;
  budget: number | { min: number; max: number };
  category: string;
  skills: string[];
  experience: 'entry' | 'intermediate' | 'expert';
  location: 'remote' | 'onsite' | 'hybrid';
  duration: string;
  status: 'open' | 'in-progress' | 'completed';
  postedAt: string;
  proposals: number;
  client: {
    name: string;
    memberSince: string;
    jobsPosted: number;
    hireRate: number;
    rating: number;
  };
}

export interface Freelancer {
  id: string;
  name: string;
  title: string;
  avatar: string;
  rating: number;
  hourlyRate: number;
  skills: string[];
  experience: string;
  location: string;
  portfolio: PortfolioItem[];
  reviews: Review[];
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  image: string;
  link?: string;
}

export interface Review {
  id: string;
  clientName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Category {
  id: string;
  name: string;
  jobCount: number;
}

export const categories: Category[] = [
  { id: 'web-development', name: 'Web Development', jobCount: 245 },
  { id: 'mobile-development', name: 'Mobile Development', jobCount: 189 },
  { id: 'design', name: 'Design & Creative', jobCount: 156 },
  { id: 'writing', name: 'Writing & Translation', jobCount: 134 },
  { id: 'marketing', name: 'Digital Marketing', jobCount: 98 },
  { id: 'data-science', name: 'Data Science', jobCount: 87 },
  { id: 'video-animation', name: 'Video & Animation', jobCount: 76 },
  { id: 'admin-support', name: 'Admin & Support', jobCount: 65 },
];

export const jobs: Job[] = [
  {
    id: '1',
    title: 'Full-Stack React Developer for E-commerce Platform',
    description: 'We need an experienced React developer to help us build a modern e-commerce platform with features like user authentication, product catalog, shopping cart, and payment integration.',
    budget: { min: 3000, max: 8000 },
    category: 'web-development',
    skills: ['React', 'TypeScript', 'Node.js', 'MongoDB', 'Stripe'],
    experience: 'intermediate',
    location: 'remote',
    duration: '4-6 weeks',
    status: 'open',
    postedAt: '2024-01-15',
    proposals: 12,
    client: {
      name: 'TechStart Inc.',
      memberSince: '2023-06-01',
      jobsPosted: 8,
      hireRate: 85,
      rating: 4.8
    }
  },
  {
    id: '2',
    title: 'UI/UX Designer for Mobile App',
    description: 'Looking for a talented designer to create beautiful and intuitive user interfaces for our mobile application. Must have experience with Figma and mobile design principles.',
    budget: 2500,
    category: 'design',
    skills: ['Figma', 'UI/UX Design', 'Mobile Design', 'Prototyping', 'User Research'],
    experience: 'expert',
    location: 'hybrid',
    duration: '3-4 weeks',
    status: 'open',
    postedAt: '2024-01-14',
    proposals: 8,
    client: {
      name: 'AppVenture',
      memberSince: '2023-09-15',
      jobsPosted: 12,
      hireRate: 92,
      rating: 4.9
    }
  },
  {
    id: '3',
    title: 'Content Writer for Tech Blog',
    description: 'We need engaging content writers to create high-quality articles about technology trends, programming tutorials, and industry insights for our tech blog.',
    budget: { min: 500, max: 1500 },
    category: 'writing',
    skills: ['Content Writing', 'Technical Writing', 'SEO', 'Technology', 'Research'],
    experience: 'entry',
    location: 'remote',
    duration: 'Ongoing',
    status: 'open',
    postedAt: '2024-01-13',
    proposals: 25,
    client: {
      name: 'TechBlog Pro',
      memberSince: '2023-03-20',
      jobsPosted: 45,
      hireRate: 78,
      rating: 4.6
    }
  }
];

export const freelancers: Freelancer[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    title: 'Senior Full-Stack Developer',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    rating: 4.9,
    hourlyRate: 75,
    skills: ['React', 'Node.js', 'Python', 'AWS', 'Docker'],
    experience: '8 years',
    location: 'San Francisco, CA',
    portfolio: [
      {
        id: '1',
        title: 'E-commerce Platform',
        description: 'Built a scalable e-commerce solution with React and Node.js',
        image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300&h=200&fit=crop'
      }
    ],
    reviews: [
      {
        id: '1',
        clientName: 'John Smith',
        rating: 5,
        comment: 'Excellent work and communication. Highly recommended!',
        date: '2024-01-10'
      }
    ]
  },
  {
    id: '2',
    name: 'Michael Chen',
    title: 'UI/UX Designer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    rating: 4.8,
    hourlyRate: 60,
    skills: ['Figma', 'Sketch', 'Adobe Creative Suite', 'Prototyping', 'User Research'],
    experience: '6 years',
    location: 'New York, NY',
    portfolio: [
      {
        id: '2',
        title: 'Mobile App Design',
        description: 'Designed user interfaces for a popular fitness app',
        image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=300&h=200&fit=crop'
      }
    ],
    reviews: [
      {
        id: '2',
        clientName: 'Lisa Wang',
        rating: 5,
        comment: 'Creative and professional designer. Great attention to detail.',
        date: '2024-01-08'
      }
    ]
  }
];
