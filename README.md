# OutreachHQ

Production-grade cold outreach and job application automation system built with:

- React dashboard
- NestJS API
- MongoDB with Mongoose
- BullMQ with Redis
- Nodemailer SMTP delivery
- CSV and PDF parsing

## Apps

- `apps/api`: REST API, queue orchestration, MongoDB models
- `apps/worker`: BullMQ worker for email dispatch
- `apps/web`: Admin dashboard

## Quick start

1. Copy `.env.example` to `.env` and fill in values.
2. Run `docker-compose up -d` for MongoDB and Redis.
3. Run `npm install`.
4. Run `npm run dev`.

## Core features

- JWT auth
- Bulk CSV lead import
- SMTP account rotation with safe send limits
- Campaign scheduling, queueing, and follow-ups
- Resume routing by keyword rules
- Live status dashboard with duplicate-send protection

