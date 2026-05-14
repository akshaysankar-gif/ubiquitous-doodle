# Ticket Intelligence - Project Overview

## Description
Ticket Intelligence is a production-ready Next.js 14 API and database layer designed for analyzing support tickets. It features a robust analysis pipeline using GPT-4o to classify and score tickets based on various dimensions such as intent, severity, and resolution quality.

## Tech Stack
- **Framework:** Next.js 14 (App Router, API routes only)
- **Language:** TypeScript (Strict Mode)
- **Database:** Prisma ORM + Supabase (PostgreSQL)
- **AI:** OpenAI GPT-4o
- **Parsing:** `papaparse` (CSV), `xlsx` (Excel)
- **Auth:** NextAuth.js (Credentials Provider)
- **Hosting:** Vercel + Supabase

## Current Status
- [x] Project initialized with Next.js 14 and TypeScript.
- [x] Install dependencies (Backend & Frontend).
- [x] Configure Prisma and Database Schema.
- [x] Implement Parsing Logic (`lib/parser.ts`).
- [x] Implement GPT-4o Analysis Pipeline (`lib/analyzer.ts`).
- [x] Implement API Routes (Auth, Upload, Analyze, Stats, Tickets).
- [x] Setup Seeding and Testing.
- [x] Implement Frontend Shell and Navigation.
- [x] Build Reusable UI Components.
- [x] Implement Dashboard and Data Admin Pages.
- [x] Implement Ticket Drawer with AI Insights.
- [x] Secured all routes with NextAuth.js.
- [x] Final build passed with zero errors.

## Database Schema
The database includes models for:
- **User:** Authentication and role-based access.
- **TicketBatch:** Grouping of uploaded tickets.
- **Ticket:** Detailed ticket information, including raw fields, derived flags, and GPT-4o analysis results.

## Analysis dimensions
- **Classification:** Primary intent, sub-intent, severity, business risk, product area, root cause, frustration level, automation level, effort, systemic signal, customer ask.
- **Quality Scoring:** Resolution quality, communication clarity, escalation judgment, categorization accuracy.
