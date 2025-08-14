// Simplified Aptos client for deployment - will need to be updated with correct SDK v2 imports
// For now, this provides the interface structure without the actual blockchain calls

// Job status constants
export const JOB_STATUS = {
  ACTIVE: 1,
  COMPLETED: 2,
} as const;

export interface JobInfo {
  client: string;
  freelancer: string;
  escrowAmount: number;
  status: number;
}

export interface CreateJobParams {
  freelancer: string;
  escrowAmount: number;
  jobDescription: string;
}

export interface CompleteJobParams {
  jobOwner: string;
}

/**
 * Convert APT to Octas (smallest unit)
 */
export function aptToOctas(apt: number): number {
  return Math.floor(apt * 100000000);
}

/**
 * Convert Octas to APT
 */
export function octasToApt(octas: number): number {
  return octas / 100000000;
}

/**
 * Get account balance in APT (mock implementation for deployment)
 */
export async function getAccountBalance(accountAddress: string): Promise<number> {
  // Mock implementation for deployment
  return 10.0; // Return 10 APT as mock balance
}

/**
 * Create a new job with escrow (mock implementation for deployment)
 */
export async function createJob(
  account: any,
  params: CreateJobParams
): Promise<string> {
  // Mock implementation for deployment
  console.log('Mock: Creating job with params:', params);
  
  // Simulate transaction delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Return mock transaction hash
  return '0x' + 'a'.repeat(64);
}

/**
 * Complete a job and release escrow (mock implementation for deployment)
 */
export async function completeJob(
  account: any,
  params: CompleteJobParams
): Promise<string> {
  // Mock implementation for deployment
  console.log('Mock: Completing job with params:', params);
  
  // Simulate transaction delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Return mock transaction hash
  return '0x' + 'b'.repeat(64);
}

/**
 * Get job information (mock implementation for deployment)
 */
export async function getJobInfo(jobOwner: string): Promise<JobInfo | null> {
  // Mock implementation for deployment
  return {
    client: '0x' + 'c'.repeat(62),
    freelancer: '0x' + 'd'.repeat(62),
    escrowAmount: 1.5,
    status: JOB_STATUS.ACTIVE,
  };
}

/**
 * Check if an account exists (mock implementation for deployment)
 */
export async function accountExists(address: string): Promise<boolean> {
  // Mock implementation for deployment
  return true;
}

/**
 * Get transaction details (mock implementation for deployment)
 */
export async function getTransactionDetails(txnHash: string) {
  // Mock implementation for deployment
  return {
    hash: txnHash,
    status: 'success',
    timestamp: new Date().toISOString(),
  };
}

// Export a mock client for compatibility
export const aptosClient = {
  getAccountResources: async () => [],
  generateTransaction: async () => ({}),
  signTransaction: async () => ({}),
  submitTransaction: async () => ({ hash: '0x' + 'e'.repeat(64) }),
  waitForTransaction: async () => ({}),
  getTransactionByHash: async () => ({}),
  view: async () => [],
};
