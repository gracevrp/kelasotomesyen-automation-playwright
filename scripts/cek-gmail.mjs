import 'dotenv/config';
import { google } from 'googleapis';

const auth = new google.auth.OAuth2(
  process.env.GMAIL_CLIENT_ID,
  process.env.GMAIL_CLIENT_SECRET
);
auth.setCredentials({ refresh_token: process.env.GMAIL_REFRESH_TOKEN });

const gmail = google.gmail({ version: 'v1', auth });
const res = await gmail.users.getProfile({ userId: 'me' });
console.log('Terhubung ke:', res.data.emailAddress);