import { Job } from '../data/mockData';

export interface PostedJob extends Job {
  clientId: string;
  postedBy: string;
  createdAt: Date;
}

// Persistent storage for posted jobs using localStorage
const STORAGE_KEY = 'posted_jobs';

const getStoredJobs = (): PostedJob[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading jobs from localStorage:', error);
    return [];
  }
};

const saveJobsToStorage = (jobs: PostedJob[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
  } catch (error) {
    console.error('Error saving jobs to localStorage:', error);
  }
};

let postedJobs: PostedJob[] = getStoredJobs();

export class JobService {
  /**
   * Post a new job
   */
  static async postJob(jobData: Omit<PostedJob, 'id' | 'createdAt' | 'status' | 'proposals' | 'client'>): Promise<PostedJob> {
    const newJob: PostedJob = {
      ...jobData,
      id: this.generateJobId(),
      createdAt: new Date(),
      status: 'open',
      proposals: 0,
      client: {
        name: jobData.postedBy,
        memberSince: new Date().toISOString().split('T')[0],
        jobsPosted: 1,
        hireRate: 100,
        rating: 5.0
      }
    };

    postedJobs.push(newJob);
    saveJobsToStorage(postedJobs);

    // Simulate API delay
    await this.delay(1000);

    return newJob;
  }

  /**
   * Get all posted jobs
   */
  static async getAllJobs(): Promise<PostedJob[]> {
    // Refresh from localStorage to ensure we have the latest data
    postedJobs = getStoredJobs();
    
    // Simulate API delay
    await this.delay(500);
    
    return [...postedJobs].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  /**
   * Get jobs posted by a specific client
   */
  static async getJobsByClient(clientId: string): Promise<PostedJob[]> {
    // Refresh from localStorage to ensure we have the latest data
    postedJobs = getStoredJobs();
    
    const clientJobs = postedJobs.filter(job => job.clientId === clientId);
    
    // Simulate API delay
    await this.delay(500);
    
    return clientJobs.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  /**
   * Get a specific job by ID
   */
  static async getJobById(jobId: string): Promise<PostedJob | null> {
    const job = postedJobs.find(job => job.id === jobId);
    
    // Simulate API delay
    await this.delay(300);
    
    return job || null;
  }

  /**
   * Update job status
   */
  static async updateJobStatus(jobId: string, status: 'open' | 'in-progress' | 'completed'): Promise<PostedJob> {
    // Refresh from localStorage to ensure we have the latest data
    postedJobs = getStoredJobs();
    
    const job = postedJobs.find(job => job.id === jobId);
    
    if (!job) {
      throw new Error('Job not found');
    }

    job.status = status;
    saveJobsToStorage(postedJobs);

    // Simulate API delay
    await this.delay(500);

    return job;
  }

  /**
   * Delete a job
   */
  static async deleteJob(jobId: string, clientId: string): Promise<boolean> {
    // Refresh from localStorage to ensure we have the latest data
    postedJobs = getStoredJobs();
    
    const jobIndex = postedJobs.findIndex(job => job.id === jobId && job.clientId === clientId);
    
    if (jobIndex === -1) {
      throw new Error('Job not found or unauthorized');
    }

    postedJobs.splice(jobIndex, 1);
    saveJobsToStorage(postedJobs);

    // Simulate API delay
    await this.delay(500);

    return true;
  }

  /**
   * Get job statistics
   */
  static async getJobStats(): Promise<{
    totalJobs: number;
    openJobs: number;
    inProgressJobs: number;
    completedJobs: number;
  }> {
    // Refresh from localStorage to ensure we have the latest data
    postedJobs = getStoredJobs();
    
    const totalJobs = postedJobs.length;
    const openJobs = postedJobs.filter(job => job.status === 'open').length;
    const inProgressJobs = postedJobs.filter(job => job.status === 'in-progress').length;
    const completedJobs = postedJobs.filter(job => job.status === 'completed').length;

    return {
      totalJobs,
      openJobs,
      inProgressJobs,
      completedJobs
    };
  }

  /**
   * Clear all jobs (for testing purposes)
   */
  static clearAllJobs(): void {
    postedJobs = [];
    saveJobsToStorage(postedJobs);
  }

  /**
   * Get storage key for debugging
   */
  static getStorageKey(): string {
    return STORAGE_KEY;
  }

  /**
   * Generate unique job ID
   */
  private static generateJobId(): string {
    return 'job_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Simulate API delay
   */
  private static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Export singleton instance
export const jobService = new JobService();
