import React, { createContext, useContext, useEffect, useState } from 'react';
import { Account } from '@aptos-labs/ts-sdk';
import { aptosClient, getAccountBalance } from '../utils/aptosClient';

interface WalletContextType {
  account: Account | null;
  address: string | null;
  balance: number;
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  createAccount: () => Promise<void>;
  importAccount: (privateKey: string) => Promise<void>;
  refreshBalance: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

interface WalletProviderProps {
  children: React.ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [account, setAccount] = useState<Account | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<number>(0);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Load wallet from localStorage on mount
  useEffect(() => {
    const savedPrivateKey = localStorage.getItem('aptos_private_key');
    if (savedPrivateKey) {
      try {
        // Create mock account for saved private key
        const mockAccount = {
          address: () => ({ toString: () => '0x' + savedPrivateKey.substring(0, 62) }),
          signingKey: { secretKey: new Uint8Array(32) }
        } as any;
        
        setAccount(mockAccount);
        setAddress(mockAccount.address().toString());
        setIsConnected(true);
        refreshBalance();
      } catch (err) {
        console.error('Failed to load saved wallet:', err);
        localStorage.removeItem('aptos_private_key');
      }
    }
  }, []);

  // Refresh balance when account changes
  useEffect(() => {
    if (address) {
      refreshBalance();
    }
  }, [address]);

  const createAccount = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Generate new account with mock implementation for deployment
      const mockAccount = {
        address: () => ({ toString: () => '0x' + Math.random().toString(16).substring(2, 64) }),
        signingKey: { secretKey: new Uint8Array(32) }
      } as any;
      
      const privateKey = 'mock_private_key_' + Math.random().toString(16).substring(2, 34);
      
      // Save to localStorage
      localStorage.setItem('aptos_private_key', privateKey);
      
      // Set account
      setAccount(mockAccount);
      setAddress(mockAccount.address().toString());
      setIsConnected(true);
      
      console.log('New mock account created:', mockAccount.address().toString());
    } catch (err) {
      setError('Failed to create account');
      console.error('Error creating account:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const importAccount = async (privateKey: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Validate private key format (relaxed for mock implementation)
      if (privateKey.length < 10) {
        throw new Error('Invalid private key format');
      }
      
      // Create mock account from private key
      const mockAccount = {
        address: () => ({ toString: () => '0x' + privateKey.substring(0, 62) }),
        signingKey: { secretKey: new Uint8Array(32) }
      } as any;
      
      // Save to localStorage
      localStorage.setItem('aptos_private_key', privateKey);
      
      // Set account
      setAccount(mockAccount);
      setAddress(mockAccount.address().toString());
      setIsConnected(true);
      
      console.log('Mock account imported:', mockAccount.address().toString());
    } catch (err) {
      setError('Failed to import account');
      console.error('Error importing account:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const connectWallet = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Check if wallet exists in localStorage
      const savedPrivateKey = localStorage.getItem('aptos_private_key');
      
      if (savedPrivateKey) {
        await importAccount(savedPrivateKey);
      } else {
        // Create new account if none exists
        await createAccount();
      }
    } catch (err) {
      setError('Failed to connect wallet');
      console.error('Error connecting wallet:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setAddress(null);
    setBalance(0);
    setIsConnected(false);
    setError(null);
    localStorage.removeItem('aptos_private_key');
  };

  const refreshBalance = async () => {
    if (!address) return;
    
    try {
      const accountBalance = await getAccountBalance(address);
      setBalance(accountBalance);
    } catch (err) {
      console.error('Error refreshing balance:', err);
    }
  };

  const value: WalletContextType = {
    account,
    address,
    balance,
    isConnected,
    isLoading,
    error,
    connectWallet,
    disconnectWallet,
    createAccount,
    importAccount,
    refreshBalance,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};
