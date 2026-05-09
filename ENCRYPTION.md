# Message Encryption Implementation Guide

This guide outlines the strategy and steps to implement End-to-End Encryption (E2EE) for messages in the Communicate Each Other application.

## 1. Objective
Ensure that message content is encrypted on the sender's device and decrypted only on the recipient's device. The server will store and transmit only the encrypted ciphertext.

## 2. Technical Stack
- **Algorithm:** AES-GCM (256-bit)
- **Library:** [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API) (Native browser support, no external dependencies required).
- **Encoding:** Base64 for storing encrypted blobs (IV + Ciphertext).

## 3. Encryption Strategy

### Key Management
For this implementation, we will use a **Room-Based Key** approach:
1. Each room has a unique passphrase/secret.
2. The encryption key is derived from this passphrase using PBKDF2.
3. Users must know the room secret to read/send messages.

### Data Flow
1. **Sending:**
   - User types message.
   - Frontend generates a random Initialization Vector (IV).
   - Frontend encrypts the content using the Room Key and IV.
   - Frontend concatenates `IV` and `Ciphertext` and encodes to Base64.
   - Encrypted string is sent via Socket.io.
2. **Receiving:**
   - Frontend receives encrypted string.
   - Frontend decodes Base64 and splits it into `IV` and `Ciphertext`.
   - Frontend decrypts using the Room Key and extracted `IV`.
   - Decrypted content is displayed.

## 4. Implementation Steps

### Step 1: Encryption Utility (Frontend)
Create a utility file `frontend/src/utils/crypto.ts`:
```typescript
const ALGORITHM = 'AES-GCM';

export async function deriveKey(passphrase: string, salt: string) {
  const enc = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    enc.encode(passphrase),
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey']
  );
  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: enc.encode(salt),
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: ALGORITHM, length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
}

export async function encryptMessage(text: string, key: CryptoKey) {
  const enc = new TextEncoder();
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const ciphertext = await window.crypto.subtle.encrypt(
    { name: ALGORITHM, iv },
    key,
    enc.encode(text)
  );
  
  // Combine IV and Ciphertext
  const combined = new Uint8Array(iv.length + ciphertext.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(ciphertext), iv.length);
  
  return btoa(String.fromCharCode(...combined));
}

export async function decryptMessage(encoded: string, key: CryptoKey) {
  const combined = new Uint8Array(atob(encoded).split('').map(c => c.charCodeAt(0)));
  const iv = combined.slice(0, 12);
  const ciphertext = combined.slice(12);
  
  const decrypted = await window.crypto.subtle.decrypt(
    { name: ALGORITHM, iv },
    key,
    ciphertext
  );
  
  return new TextDecoder().decode(decrypted);
}
```

### Step 2: Update Room Context/State
Modify `Room` model or local state to include a `passphrase`. In a real-world scenario, this would be exchanged securely.

### Step 3: Integrate into Components
- **`MessageInput.tsx`:** Call `encryptMessage` before emitting `send_message`.
- **`MessageList.tsx`:** Call `decryptMessage` when rendering messages.
- **`messageService.ts`:** Decrypt messages fetched via REST API.

## 5. Security Considerations
- **Salt:** Use a unique salt per room (e.g., the `roomId`).
- **Passphrase Storage:** Never store the plaintext passphrase on the server.
- **Key Persistence:** Store the derived key in memory or `sessionStorage`, never in `localStorage` for long-term if security is a priority.

## 6. Future Enhancements
- Implement RSA-based key exchange so users don't have to manually share a passphrase.
- Add "Key Rotation" support.
