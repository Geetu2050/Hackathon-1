import { JobService } from '../JobService';

describe('JobService', () => {
  beforeEach(() => {
    // Clear any existing jobs before each test
    // In a real implementation, you'd have a method to clear the mock storage
  });

  test('should post a new job', async () => {
    const jobData = {
      title: 'Test Job',
      description: 'Test job description',
      budget: 1000,
      category: 'web-development',
      skills: ['React', 'TypeScript'],
      experience: 'intermediate' as const,
      location: 'remote' as const,
      duration: '2 weeks',
      postedAt: '2024-01-15',
      clientId: 'test-client',
      postedBy: 'Test Client',
    };

    const postedJob = await JobService.postJob(jobData);

    expect(postedJob).toBeDefined();
    expect(postedJob.title).toBe('Test Job');
    expect(postedJob.clientId).toBe('test-client');
    expect(postedJob.status).toBe('open');
    expect(postedJob.proposals).toBe(0);
  });

  test('should get all jobs', async () => {
    // Post a job first
    const jobData = {
      title: 'Test Job 2',
      description: 'Test job description 2',
      budget: 2000,
      category: 'design',
      skills: ['Figma', 'UI/UX'],
      experience: 'expert' as const,
      location: 'hybrid' as const,
      duration: '3 weeks',
      postedAt: '2024-01-16',
      clientId: 'test-client-2',
      postedBy: 'Test Client 2',
    };

    await JobService.postJob(jobData);

    const allJobs = await JobService.getAllJobs();
    expect(allJobs.length).toBeGreaterThan(0);
  });

  test('should get jobs by client', async () => {
    const clientId = 'specific-client';
    
    // Post jobs for the specific client
    const jobData1 = {
      title: 'Client Job 1',
      description: 'First job for specific client',
      budget: 1500,
      category: 'web-development',
      skills: ['React'],
      experience: 'entry' as const,
      location: 'remote' as const,
      duration: '1 week',
      postedAt: '2024-01-17',
      clientId,
      postedBy: 'Specific Client',
    };

    const jobData2 = {
      title: 'Client Job 2',
      description: 'Second job for specific client',
      budget: 2500,
      category: 'mobile-development',
      skills: ['React Native'],
      experience: 'intermediate' as const,
      location: 'onsite' as const,
      duration: '4 weeks',
      postedAt: '2024-01-18',
      clientId,
      postedBy: 'Specific Client',
    };

    await JobService.postJob(jobData1);
    await JobService.postJob(jobData2);

    const clientJobs = await JobService.getJobsByClient(clientId);
    expect(clientJobs.length).toBeGreaterThanOrEqual(2);
    expect(clientJobs.every(job => job.clientId === clientId)).toBe(true);
  });
});
