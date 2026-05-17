# OutreachHQ Architecture

## Services

- React SPA for admin operations
- NestJS API for auth, CRUD, campaign orchestration, and reporting
- BullMQ worker for reliable background email delivery
- MongoDB for persistent SaaS data
- Redis for restart-safe job persistence and delayed follow-ups

## Delivery flow

1. Admin uploads leads or creates them manually.
2. Admin adds SMTP accounts and resumes.
3. Admin creates a campaign with schedule, delay, resume rules, and sender pool.
4. API creates `EmailLog` records in `PENDING` state and pushes jobs to BullMQ.
5. Worker chooses the next safe SMTP account, renders the template, attaches the right resume, and sends the message.
6. Worker updates `EmailLog`, lead status, campaign counters, and optionally schedules follow-up jobs.

## Scale notes

- Lead imports stream CSV rows into Mongo-ready batches.
- Queue jobs are stored in Redis for restart safety.
- Sending is paced by campaign delay plus account usage checks.
- Mongo indexes protect lookups across `campaignId`, `leadId`, `email`, and statuses.

