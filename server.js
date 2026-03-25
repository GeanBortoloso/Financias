import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3001;

// Configurações
const DB_FILE = path.join(__dirname, 'database.json');
const JWT_SECRET = process.env.JWT_SECRET || 'financeapp-super-secret-key-123';

// Middlewares
app.use(cors());
app.use(express.json());

// Servir arquivos estáticos do frontend (resultado do vite build)
app.use(express.static(path.join(__dirname, 'dist')));

// Manipulação do Banco de Dados JSON Local
async function getDB() {
  try {
    const data = await fs.readFile(DB_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      const init = { users: [], transactions: [] };
      await fs.writeFile(DB_FILE, JSON.stringify(init, null, 2));
      return init;
    }
    throw error;
  }
}

async function saveDB(data) {
  await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2));
}

// Middleware de Autenticação JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Formato "Bearer TOKEN"
  if (!token) return res.status(401).json({ error: 'Token não fornecido' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token inválido ou expirado' });
    req.user = user;
    next();
  });
};

/* ==================================================
   ROTAS DE AUTENTICAÇÃO (Cadastro e Login)
================================================== */

app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Preencha todos os campos.' });
  }

  const db = await getDB();
  const userExists = db.users.find(u => u.email === email);
  if (userExists) {
    return res.status(400).json({ error: 'E-mail já está em uso.' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    id: Date.now().toString(36) + Math.random().toString(36).substring(2),
    name,
    email,
    password: hashedPassword,
    createdAt: new Date().toISOString()
  };

  db.users.push(newUser);
  await saveDB(db);
  res.status(201).json({ message: 'Usuário registrado com sucesso.' });
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'E-mail e senha são obrigatórios.' });
  }

  const db = await getDB();
  const user = db.users.find(u => u.email === email);
  if (!user) {
    return res.status(400).json({ error: 'Usuário ou senha incorretos.' });
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(400).json({ error: 'Usuário ou senha incorretos.' });
  }

  const token = jwt.sign(
    { id: user.id, name: user.name, email: user.email },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
  
  res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
});

/* ==================================================
   ROTAS DE TRANSAÇÃO (Protegidas pelo Token)
================================================== */

app.get('/api/transactions', authenticateToken, async (req, res) => {
  const db = await getDB();
  // Filtra as transações pelo userId recebido do JWT Token
  const userTransactions = db.transactions.filter(t => t.userId === req.user.id);
  res.json(userTransactions);
});

app.post('/api/transactions', authenticateToken, async (req, res) => {
  const db = await getDB();
  const novaTransacao = {
    ...req.body,
    id: Date.now().toString(36) + Math.random().toString(36).substring(2),
    userId: req.user.id, // Registra o ID de qual usuário criou
    createdAt: new Date().toISOString()
  };
  
  db.transactions.push(novaTransacao);
  await saveDB(db);
  res.status(201).json(novaTransacao);
});

app.delete('/api/transactions/:id', authenticateToken, async (req, res) => {
  const db = await getDB();
  // Apenas deleta se o ID bater E o criador for o mesmo do Token JWT (impede deleção cruzada)
  const txIndex = db.transactions.findIndex(t => t.id === req.params.id && t.userId === req.user.id);
  
  if (txIndex > -1) {
    db.transactions.splice(txIndex, 1);
    await saveDB(db);
    res.status(204).send();
  } else {
    res.status(404).json({ error: 'Transação não encontrada ou sem permissão.' });
  }
});

// SPA Fallback — qualquer rota que não seja /api/* retorna o index.html
app.get('{*any}', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Finanças rodando em http://0.0.0.0:${port}`);
  getDB().then(() => console.log('Banco database.json (NoSQL Local) operando.'));
});
