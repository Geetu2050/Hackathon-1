// Job Completion Service - Handles authentication and approval logic
import { Job } from '../data/mockData';

export interface JobCompletion {
  id: string;
  jobId: string;
  completionNotes: string;
  deliverables: string[];
  submittedAt: Date;
  status: 'pending' | 'approved' | 'rejected';
  clientFeedback?: string;
  clientSignature?: string;
  approvalDate?: Date;
  rejectionDate?: Date;
}

export interface CompletionSubmission {
  jobId: string;
  completionNotes: string;
  deliverables: string[];
  clientPassword: string;
  clientSignature: string;
}

export interface ApprovalData {
  completionId: string;
  clientPassword: string;
  clientSignature: string;
  approvalNotes: string;
}

export interface RejectionData {
  completionId: string;
  clientPassword: string;
  rejectionReason: string;
  feedback: string;
}

// Mock storage for job completions (in real app, this would be a database)
const jobCompletions: JobCompletion[] = [];

// Mock client credentials (in real app, this would be stored securely)
const mockClientCredentials = {
  'client123': {
    password: 'securePassword123',
    signature: 'client123_signature_2024',
    name: 'John Client'
  },
  'client456': {
    password: 'anotherSecurePass456',
    signature: 'client456_signature_2024',
    name: 'Jane Client'
  }
};

export class JobCompletionService {
  /**
   * Submit a job completion request
   */
  static async submitCompletion(submission: CompletionSubmission): Promise<JobCompletion> {
    // Validate client credentials
    const clientId = this.extractClientIdFromJob(submission.jobId);
    const clientCreds = mockClientCredentials[clientId];
    
    if (!clientCreds) {
      throw new Error('Client not found for this job');
    }

    if (clientCreds.password !== submission.clientPassword) {
      throw new Error('Invalid client password');
    }

    if (clientCreds.signature !== submission.clientSignature) {
      throw new Error('Invalid client signature');
    }

    // Create completion record
    const completion: JobCompletion = {
      id: this.generateId(),
      jobId: submission.jobId,
      completionNotes: submission.completionNotes,
      deliverables: submission.deliverables.filter(d => d.trim()),
      submittedAt: new Date(),
      status: 'pending',
      clientSignature: submission.clientSignature,
    };

    // Store completion
    jobCompletions.push(completion);

    // Simulate API delay
    await this.delay(1000);

    return completion;
  }

  /**
   * Approve a job completion
   */
  static async approveCompletion(approvalData: ApprovalData): Promise<JobCompletion> {
    const completion = jobCompletions.find(c => c.id === approvalData.completionId);
    
    if (!completion) {
      throw new Error('Completion not found');
    }

    if (completion.status !== 'pending') {
      throw new Error('Completion is not pending approval');
    }

    // Validate client credentials again
    const clientId = this.extractClientIdFromJob(completion.jobId);
    const clientCreds = mockClientCredentials[clientId];
    
    if (!clientCreds) {
      throw new Error('Client not found for this job');
    }

    if (clientCreds.password !== approvalData.clientPassword) {
      throw new Error('Invalid client password');
    }

    if (clientCreds.signature !== approvalData.clientSignature) {
      throw new Error('Invalid client signature');
    }

    // Update completion status
    completion.status = 'approved';
    completion.clientFeedback = approvalData.approvalNotes;
    completion.approvalDate = new Date();

    // Simulate API delay
    await this.delay(1000);

    return completion;
  }

  /**
   * Reject a job completion
   */
  static async rejectCompletion(rejectionData: RejectionData): Promise<JobCompletion> {
    const completion = jobCompletions.find(c => c.id === rejectionData.completionId);
    
    if (!completion) {
      throw new Error('Completion not found');
    }

    if (completion.status !== 'pending') {
      throw new Error('Completion is not pending approval');
    }

    // Validate client credentials again
    const clientId = this.extractClientIdFromJob(completion.jobId);
    const clientCreds = mockClientCredentials[clientId];
    
    if (!clientCreds) {
      throw new Error('Client not found for this job');
    }

    if (clientCreds.password !== rejectionData.clientPassword) {
      throw new Error('Invalid client password');
    }

    // Update completion status
    completion.status = 'rejected';
    completion.clientFeedback = rejectionData.feedback;
    completion.rejectionDate = new Date();

    // Simulate API delay
    await this.delay(1000);

    return completion;
  }

  /**
   * Get all completions for a specific job
   */
  static async getJobCompletions(jobId: string): Promise<JobCompletion[]> {
    const completions = jobCompletions.filter(c => c.jobId === jobId);
    
    // Simulate API delay
    await this.delay(500);

    return completions.sort((a, b) => b.submittedAt.getTime() - a.submittedAt.getTime());
  }

  /**
   * Get a specific completion by ID
   */
  static async getCompletion(completionId: string): Promise<JobCompletion | null> {
    const completion = jobCompletions.find(c => c.id === completionId);
    
    // Simulate API delay
    await this.delay(300);

    return completion || null;
  }

  /**
   * Get all pending completions for a client
   */
  static async getPendingCompletionsForClient(clientId: string): Promise<JobCompletion[]> {
    const completions = jobCompletions.filter(c => {
      const completionClientId = this.extractClientIdFromJob(c.jobId);
      return completionClientId === clientId && c.status === 'pending';
    });
    
    // Simulate API delay
    await this.delay(500);

    return completions.sort((a, b) => b.submittedAt.getTime() - a.submittedAt.getTime());
  }

  /**
   * Validate client credentials
   */
  static validateClientCredentials(clientId: string, password: string, signature: string): boolean {
    const clientCreds = mockClientCredentials[clientId];
    
    if (!clientCreds) {
      return false;
    }

    return clientCreds.password === password && clientCreds.signature === signature;
  }

  /**
   * Get client information
   */
  static getClientInfo(clientId: string) {
    return mockClientCredentials[clientId] || null;
  }

  /**
   * Extract client ID from job ID (mock implementation)
   */
  private static extractClientIdFromJob(jobId: string): string {
    // In a real app, this would query the job to get the client ID
    // For now, we'll use a simple mapping based on job ID pattern
    if (jobId.startsWith('job_')) {
      // For posted jobs, extract client ID from the job data
      // This is a simplified approach - in real app, you'd query the job
      return 'client123'; // Default client for posted jobs
    }
    
    // Legacy mapping for demo jobs
    const jobClientMap: { [key: string]: string } = {
      'job1': 'client123',
      'job2': 'client456',
      'job3': 'client123',
      'job4': 'client456',
      'demo-job-1': 'client123',
    };
    
    return jobClientMap[jobId] || 'client123'; // Default fallback
  }

  /**
   * Generate unique ID
   */
  private static generateId(): string {
    return 'completion_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Simulate API delay
   */
  private static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Export singleton instance
export const jobCompletionService = new JobCompletionService();
