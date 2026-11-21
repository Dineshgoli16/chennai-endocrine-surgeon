import express from 'express';
import cors from 'cors';
import multer from 'multer';
import nodemailer from 'nodemailer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env.local or .env
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
app.use(cors());
app.use(express.json());

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Adarsh*321';

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
app.use('/uploads', express.static(uploadDir));

// JSON database file for zero-config local/shared hosting
const dbFile = path.join(__dirname, 'database.json');
const initialDB = {
  announcement: 'Now offering Specialized Endocrine & Scarless Thyroid (TOETVA) Clinics at SIMS Vadapalani & Lifeline Kilpauk',
  appointments: [],
  media: []
};

function readDB() {
  try {
    if (!fs.existsSync(dbFile)) {
      fs.writeFileSync(dbFile, JSON.stringify(initialDB, null, 2));
      return initialDB;
    }
    const data = fs.readFileSync(dbFile, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading JSON db:', err);
    return initialDB;
  }
}

function writeDB(data) {
  try {
    fs.writeFileSync(dbFile, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error writing JSON db:', err);
  }
}

// Ensure database file initialized
readDB();

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB
});

// Nodemailer Transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '465'),
  secure: process.env.SMTP_SECURE !== 'false',
  auth: {
    user: process.env.EMAIL_USER || '',
    pass: process.env.EMAIL_PASS || ''
  },
  tls: {
    rejectUnauthorized: false
  }
});

// --- API ROUTES ---

// 1. Password Verification
app.post('/api/verify', (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    res.json({ success: true });
  } else {
    res.status(401).json({ error: 'Unauthorized: Incorrect password' });
  }
});

// 2. Announcements
app.get('/api/announcement', (req, res) => {
  const db = readDB();
  res.json({ text: db.announcement || '' });
});

app.post('/api/announcement', (req, res) => {
  const { password, text } = req.body;
  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const db = readDB();
  db.announcement = text || '';
  writeDB(db);
  res.json({ success: true, text: db.announcement });
});

// 3. Appointments
app.post('/api/appointments', async (req, res) => {
  const { name, phone, city, specialty, preferred_date, symptoms } = req.body;
  if (!name || !phone) {
    return res.status(400).json({ error: 'Name and phone are required' });
  }

  const db = readDB();
  const newAppointment = {
    id: Date.now().toString(),
    name,
    phone,
    city: city || 'Chennai',
    specialty: specialty || 'Thyroid / Parathyroid',
    preferred_date: preferred_date || '',
    symptoms: symptoms || '',
    booked_at: new Date().toISOString()
  };

  db.appointments.unshift(newAppointment);
  writeDB(db);

  // Send Email Notification if SMTP configured
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    try {
      const notifyEmail = process.env.NOTIFICATION_EMAIL || process.env.EMAIL_USER;
      await transporter.sendMail({
        from: `"Dr. Adarsh Raghavan Practice" <${process.env.EMAIL_USER}>`,
        to: notifyEmail,
        subject: `New Patient Appointment: ${name} (${specialty})`,
        text: `You have received a new consultation request on the website:\n\nPatient Name: ${name}\nPhone: ${phone}\nLocation: ${city}\nSpecialty: ${specialty}\nPreferred Date: ${preferred_date}\nSymptoms/Notes: ${symptoms}\n\nPlease follow up with the patient.`
      });
    } catch (err) {
      console.error('Failed to send email alert:', err);
    }
  }

  res.json({ success: true, appointment: newAppointment });
});

app.get('/api/appointments', (req, res) => {
  const { password } = req.query;
  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const db = readDB();
  res.json(db.appointments || []);
});

// 4. Media Gallery
app.get('/api/media', (req, res) => {
  const db = readDB();
  res.json(db.media || []);
});

app.post('/api/upload', upload.single('media'), (req, res) => {
  const { password, title, category } = req.body;
  if (password !== ADMIN_PASSWORD) {
    if (req.file) fs.unlinkSync(req.file.path);
    return res.status(401).json({ error: 'Unauthorized' });
  }
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const db = readDB();
  const isVideo = req.file.mimetype.startsWith('video/');
  const newItem = {
    id: Date.now().toString(),
    filename: req.file.filename,
    type: isVideo ? 'video' : 'image',
    title: title || req.file.originalname,
    category: category || 'Thyroid',
    uploaded_at: new Date().toISOString()
  };

  db.media.unshift(newItem);
  writeDB(db);
  res.json(newItem);
});

app.delete('/api/media/:id', (req, res) => {
  const { password } = req.body;
  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const db = readDB();
  const itemIndex = db.media.findIndex(m => m.id.toString() === req.params.id);
  if (itemIndex > -1) {
    const item = db.media[itemIndex];
    const filePath = path.join(uploadDir, item.filename);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (e) {
        console.error('File unlink error:', e);
      }
    }
    db.media.splice(itemIndex, 1);
    writeDB(db);
    return res.json({ success: true });
  }
  res.status(404).json({ error: 'Item not found' });
});

// 5. AI Chat Proxy
app.post('/api/ai/chat', async (req, res) => {
  const { message, systemPrompt } = req.body;
  const apiKey = process.env.VITE_OPENAI_API_KEY || process.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(503).json({ error: 'AI API Key not configured' });
  }

  try {
    // If OpenAI API key is present
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        max_tokens: 300,
        temperature: 0.7
      })
    });
    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || 'Thank you for reaching out. Please schedule a consultation with Dr. Adarsh Raghavan.';
    res.json({ reply });
  } catch (err) {
    console.error('AI Proxy Error:', err);
    res.status(500).json({ error: 'Failed to communicate with AI provider' });
  }
});

// Serve frontend build in production
const distPath = path.join(__dirname, '../dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api') && !req.path.startsWith('/uploads')) {
      res.sendFile(path.join(distPath, 'index.html'));
    }
  });
}

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
