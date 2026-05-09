# Communicate Each Other 🚀

**Communicate Each Other** is a modern, real-time collaboration platform designed specifically for developers. It combines the seamless experience of instant messaging with technical features like code snippet sharing and a focus on privacy.

---

## 🌟 What is this Project?
This is a full-stack real-time chat application that allows users to create and join rooms, exchange text messages, and share formatted code snippets. Built with a focus on speed and aesthetics, it uses a dark-themed, glassmorphic UI to provide a premium developer experience.

## 💡 Why is this Useful?
Generic chat apps often struggle with technical content. **Communicate Each Other** solves this by:
- **Developer-First Design:** Direct support for code blocks with syntax highlighting.
- **Low Latency:** Instant updates via Socket.io ensure a fluid conversation flow.
- **Room-Based Isolation:** Organize discussions by project, topic, or team effortlessly.

## ✨ What's Unique in This?
1. **Rich Code Snippets:** Unlike plain text apps, messages can be toggled between "Text" and "Code" modes, preserving indentation and formatting.
2. **End-to-End Encryption (E2EE) Ready:** A roadmap designed around Zero-Knowledge privacy where even the server cannot read your technical secrets.
3. **Glassmorphic UI:** A visually stunning interface built with Tailwind CSS and custom gradients that feels modern and "alive."

---

## 🛠 Tech Stack
- **Frontend:** React, TypeScript, Vite, Tailwind CSS.
- **Backend:** Node.js, Express, MongoDB.
- **Real-Time:** Socket.io (WebSockets).
- **Authentication:** JWT (JSON Web Tokens).

---

## 🌐 Deployment & Architecture
The application follows a modern cloud-native architecture for scalability and ease of deployment:

- **Backend (GCP + Docker):** The Node.js API and Socket.io server are containerized using **Docker** and deployed on **Google Cloud Platform (GCP)** (via Cloud Run or GKE). This ensures a consistent environment and seamless scaling.
- **Frontend (Vercel):** The React application is hosted on **Vercel**, benefiting from their global Edge Network for fast asset delivery and automated CI/CD.
- **Connectivity:** The frontend communicates with the GCP-hosted backend via secure HTTPS and WebSockets, configured through environment variables (e.g., `VITE_API_URL`).

---

## 🚀 Roadmap: What I will be working on
- [ ] **End-to-End Encryption:** Implementing AES-GCM client-side encryption for all messages.
- [ ] **Multi-Language Snippets:** Expanding syntax highlighting for 20+ programming languages.
- [ ] **File Sharing:** Securely sending logs, screenshots, and configuration files.
- [ ] **User Presence:** Real-time online/offline status and "user is typing" indicators.
- [ ] **Push Notifications:** Stay updated even when the tab is closed.

---

## 🔍 Critical Issue & Solution

### **The Problem: The "Centralized Trust" Dilemma**
In traditional chat apps, the server acts as a "Trusted Third Party." This means the database stores every message in plaintext. If the server is compromised or an administrator is malicious, your private technical discussions, API keys, or proprietary logic are exposed.

### **The Solution: Zero-Knowledge Architecture**
I am solving this by implementing **End-to-End Encryption (E2EE)** using the **Web Crypto API**.

**How it works:**
1. **Client-Side Key Derivation:** When you enter a room, your browser derives an encryption key from a secret passphrase (using PBKDF2). This key **never** leaves your device.
2. **Encryption at the Edge:** Before a message is sent over the network (via Socket.io), it is encrypted using **AES-GCM (256-bit)**.
3. **Blind Server:** The backend receives and stores only a Base64-encoded "blob" of ciphertext and an Initialization Vector (IV).
4. **Local Decryption:** Only users in the same room with the correct passphrase can decrypt and read the message.

This turns the server from a "vulnerable vault" into a "blind postman," ensuring that your data remains yours, no matter what happens on the infrastructure side.

---

## ⚙️ Getting Started
1. **Clone the repo:** `git clone ...`
2. **Backend:** `cd backend && npm install && npm start`
3. **Frontend:** `cd frontend && npm install && npm run dev`
4. **Environment:** Set up your `.env` with `MONGO_URI` and `JWT_SECRET`.
