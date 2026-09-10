# CollabBoard + Supabase Chatbot & Credit System

A Next.js application built with TypeScript, Tailwind CSS, and Supabase featuring workspace management and an interactive chatbot integrated with a persistent user credit deduction system.

---

## Features

- **User Authentication:** Secure sign-up and log-in powered by Supabase Auth.
- **Persistent User Credit System:** Tracks and preserves user credits in Supabase across devices and sessions.
- **Interactive Chatbot Interface (`/chatbot`):** Real-time conversational interface that deducts **1 credit** for every message sent.
- **Protected API Endpoints:** Server-side validation (`/api/chat`) that checks authentication, verifies available credit balance, and handles atomic deductions before returning a response.
- **Workspace Dashboard:** Interactive dashboard interface with row-level security enabled across all user assets.

---

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Database & Auth:** Supabase (PostgreSQL & Row Level Security)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Deployment:** Vercel

---

## Project Structure

```text
collabboard-nextjs/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts        # Server handler for credit checks & deductions
│   ├── chatbot/
│   │   └── page.tsx            # Interactive Chatbot UI page
│   └── dashboard/              # Main workspace dashboard
├── lib/
│   └── supabase/               # Supabase browser and server client configuration
├── schema.sql                  # Complete SQL schema for Supabase setup
├── .env.local                  # Environment configuration (Local only)
└── README.md
```

---

## Getting Started Locally

### 1. Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/Abdullah-Zafarr/collabboard-nextjs.git
cd collabboard-nextjs
npm install
```

---

### 2. Environment Variables Setup

Create a `.env.local` file in the root directory of the project:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
```

> **Note:** Never commit `.env.local` to GitHub. Ensure it is listed inside your `.gitignore` file.

---

### 3. Database Setup (Supabase)

1. Open your **Supabase Project Dashboard**.
2. Navigate to the **SQL Editor**.
3. Copy the contents of `schema.sql` provided in this repository, paste it into the editor, and click **Run**.

This script sets up:
- The `Credits` table (`user_id`, `user_email`, `credits_count`).
- `workspaces`, `columns`, and `activity_logs` tables.
- **Row Level Security (RLS)** policies to protect user data.

---

### 4. Running the Application

Start the local development server:

```bash
npm run dev
```

Open `http://localhost:3000` in your browser, log in, and navigate to `http://localhost:3000/chatbot` to test sending messages and watch your credit balance dynamically decrease.

---

## Database Schema Overview

```sql
CREATE TABLE public."Credits" (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL,
  credits_count INT NOT NULL DEFAULT 100
);
```
