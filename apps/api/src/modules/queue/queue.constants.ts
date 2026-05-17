export const EMAIL_SEND_QUEUE = 'email-send-queue';

export type EmailSendJob = {
  userId: string;
  campaignId: string;
  leadId: string;
  logId: string;
  step: number;
};

