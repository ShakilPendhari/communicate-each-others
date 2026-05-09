import React, { createContext, useContext, useState, useCallback } from 'react';
import { deriveKey } from '../utils/crypto';

// A system-wide "pepper" to make the derivation unique to this deployment.
const SYSTEM_SECRET = "COMMUNICATE_SYSTEM_ENCRYPTION_PEPPER_2024";

interface EncryptionContextType {
  keys: Record<string, CryptoKey>; // roomId -> CryptoKey
  getOrCreateKey: (roomId: string) => Promise<CryptoKey>;
}

const EncryptionContext = createContext<EncryptionContextType | undefined>(undefined);

export const EncryptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [keys, setKeys] = useState<Record<string, CryptoKey>>({});

  const getOrCreateKey = useCallback(async (roomId: string) => {
    // Return existing key if already derived
    if (keys[roomId]) return keys[roomId];

    // Otherwise derive it automatically using the roomId + system secret
    // This ensures every room has a unique key but doesn't require user input.
    const key = await deriveKey(SYSTEM_SECRET, roomId);
    setKeys((prev) => ({ ...prev, [roomId]: key }));
    return key;
  }, [keys]);

  return (
    <EncryptionContext.Provider value={{ keys, getOrCreateKey }}>
      {children}
    </EncryptionContext.Provider>
  );
};

export const useEncryption = () => {
  const context = useContext(EncryptionContext);
  if (!context) {
    throw new Error('useEncryption must be used within an EncryptionProvider');
  }
  return context;
};
