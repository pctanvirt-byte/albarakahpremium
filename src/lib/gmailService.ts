import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase lazily or reuse if already initialized
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

const provider = new GoogleAuthProvider();
// Add Gmail scopes
provider.addScope('https://www.googleapis.com/auth/gmail.readonly');
provider.addScope('https://www.googleapis.com/auth/gmail.send');
provider.addScope('https://www.googleapis.com/auth/gmail.modify');
provider.addScope('https://www.googleapis.com/auth/gmail.labels');

let isSigningIn = false;
let cachedAccessToken: string | null = null;

// Initialize auth state listener
export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else {
        // If logged in but no token, we need user interaction to re-auth
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

// Sign in with popup to get user and token
export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  if (isSigningIn) return null;
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Failed to get access token from Firebase Auth');
    }
    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = (): string | null => {
  return cachedAccessToken;
};

export const logoutGmail = async () => {
  await auth.signOut();
  cachedAccessToken = null;
};

// --- GMAIL API TYPES ---
export interface GmailMessage {
  id: string;
  threadId: string;
  snippet: string;
  subject?: string;
  from?: string;
  to?: string;
  date?: string;
  body?: string;
  labels: string[];
}

export interface GmailLabel {
  id: string;
  name: string;
  type: string;
}

// --- GMAIL REST API IMPLEMENTATIONS ---

// List labels
export const listLabels = async (token: string): Promise<GmailLabel[]> => {
  try {
    const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/labels', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to fetch labels');
    const data = await res.json();
    return data.labels || [];
  } catch (error) {
    console.error('Error fetching labels:', error);
    return [];
  }
};

// List messages with optional query and label
export const listMessages = async (
  token: string,
  options: { maxResults?: number; q?: string; labelIds?: string[] } = {}
): Promise<{ messages: { id: string; threadId: string }[]; nextPageToken?: string }> => {
  try {
    const params = new URLSearchParams();
    if (options.maxResults) params.append('maxResults', options.maxResults.toString());
    if (options.q) params.append('q', options.q);
    if (options.labelIds && options.labelIds.length > 0) {
      options.labelIds.forEach((label) => params.append('labelIds', label));
    }

    const url = `https://gmail.googleapis.com/gmail/v1/users/me/messages?${params.toString()}`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to fetch messages');
    return await res.json();
  } catch (error) {
    console.error('Error listing messages:', error);
    return { messages: [] };
  }
};

// Helper to decode base64 MIME parts
const decodeBase64 = (base64Str: string): string => {
  try {
    // Replace base64url characters to standard base64
    const standardBase64 = base64Str.replace(/-/g, '+').replace(/_/g, '/');
    return decodeURIComponent(
      atob(standardBase64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
  } catch (e) {
    try {
      return atob(base64Str.replace(/-/g, '+').replace(/_/g, '/'));
    } catch (err) {
      return 'Body parsing failed...';
    }
  }
};

// Extract message body from MIME structure
const getMessageBody = (payload: any): string => {
  if (!payload) return '';
  if (payload.body && payload.body.data) {
    return decodeBase64(payload.body.data);
  }
  if (payload.parts) {
    for (const part of payload.parts) {
      const body = getMessageBody(part);
      if (body) return body;
    }
  }
  return '';
};

// Fetch individual message details
export const getMessageDetails = async (token: string, messageId: string): Promise<GmailMessage | null> => {
  try {
    const res = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}?format=full`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error(`Failed to fetch message ${messageId}`);
    const data = await res.json();

    const headers = data.payload?.headers || [];
    const subject = headers.find((h: any) => h.name.toLowerCase() === 'subject')?.value || '(No Subject)';
    const from = headers.find((h: any) => h.name.toLowerCase() === 'from')?.value || 'Unknown Sender';
    const to = headers.find((h: any) => h.name.toLowerCase() === 'to')?.value || '';
    const date = headers.find((h: any) => h.name.toLowerCase() === 'date')?.value || '';
    const body = getMessageBody(data.payload);

    return {
      id: data.id,
      threadId: data.threadId,
      snippet: data.snippet,
      subject,
      from,
      to,
      date,
      body: body || data.snippet,
      labels: data.labelIds || [],
    };
  } catch (error) {
    console.error(`Error fetching message details for ${messageId}:`, error);
    return null;
  }
};

// Send an email
export const sendEmail = async (
  token: string,
  emailData: { to: string; subject: string; body: string }
): Promise<boolean> => {
  try {
    const emailStr = [
      `To: ${emailData.to}`,
      `Subject: ${emailData.subject}`,
      'Content-Type: text/html; charset=utf-8',
      'MIME-Version: 1.0',
      '',
      emailData.body,
    ].join('\r\n');

    const base64Safe = btoa(unescape(encodeURIComponent(emailStr)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ raw: base64Safe }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('Gmail send API error:', errText);
      throw new Error('Failed to send email');
    }
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

// Move message to trash
export const trashMessage = async (token: string, messageId: string): Promise<boolean> => {
  try {
    const res = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}/trash`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to trash message');
    return true;
  } catch (error) {
    console.error('Error trashing message:', error);
    return false;
  }
};
