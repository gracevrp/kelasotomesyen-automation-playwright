import 'dotenv/config';
import http from 'node:http';
import { google } from 'googleapis';

const PORT = 3000;
const redirectUri = `http://localhost:${PORT}/oauth2callback`;

const oauth2 = new google.auth.OAuth2(
  process.env.GMAIL_CLIENT_ID,
  process.env.GMAIL_CLIENT_SECRET,
  redirectUri
);

const url = oauth2.generateAuthUrl({
  access_type: 'offline',
  prompt: 'consent', // memaksa Google menerbitkan refresh token
  scope: ['https://www.googleapis.com/auth/gmail.readonly'],
});

console.log('Buka URL ini di browser:\n\n' + url + '\n');

http
  .createServer(async (req, res) => {
    if (!req.url.startsWith('/oauth2callback')) return;
    const code = new URL(req.url, redirectUri).searchParams.get('code');
    const { tokens } = await oauth2.getToken(code);
    res.end('Berhasil. Kembali ke terminal.');
    console.log('\nGMAIL_REFRESH_TOKEN=' + tokens.refresh_token);
    process.exit(0);
  })
  .listen(PORT);