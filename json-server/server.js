const jsonServer = require('json-server');

const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();
const dbFilePath = path.join(__dirname, 'db.json');
const SECRET_KEY = 'Paperina';
const expiresIn = '1h';

server.use(middlewares);
server.use(jsonServer.bodyParser);

// Create a JWT token
function createToken(payload) {
  return jwt.sign(payload, SECRET_KEY, { expiresIn });
}

// Verify the JWT token
function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (err) {
    console.error('Error verifying token: in server ', err); // Log di debug
    return null;
  }
}

// Read and write into db.json
const readDB = () => {
  const data = fs.readFileSync(dbFilePath, 'utf-8');
  return JSON.parse(data);
};

const writeDB = (data) => {
  console.log('Writing to db.json', data); // Log per il debug
  fs.writeFileSync(dbFilePath, JSON.stringify(data, null, 2), 'utf-8');
};

// Authentication Middleware
server.post('/usersList/login', (req, res) => {
  const { email, password } = req.body;
  const db = readDB();
  const user = db.usersList.find(user => user.email === email && user.password === password);

  if (!user) {
    return res.status(401).json({ error: 'Login failed' });
  }

  const token = createToken({ email: user.email, name: user.name });
  res.status(200).json({ token, user });//
});

// Registration Middleware
server.post('/usersList/register', (req, res) => {
  const { name, surname, email, password } = req.body;
  const db = readDB();
  const userExists = db.usersList.some(user => user.email === email);

  if (userExists) {
    return res.status(400).json({ error: 'User already exists' });
  }

  const newUser = {
    id: db.usersList.length + 1,
    name,
    surname,
    email,
    password
  };

  db.usersList.push(newUser);
  writeDB(db);
  const token = createToken({ email: newUser.email, name: newUser.name });
  res.status(201).json({ token, user: newUser });//
});

// Middleware to protect routes
server.use('/usersList*', (req, res, next) => {
  if (req.method === 'POST' || req.method === 'GET') {
    return next();
  }

  // header
  const header = req.headers['authorization'];
  console.log('Authorization header:', header); // Log di debug
  //token
  const token = header && header.split(' ')[1];
  if (!token) {
    console.log('No token provided - 401 - in Server '); // Log di debug
    return res.sendStatus(401);
  }

  // verify Token 
  const user = verifyToken(token);
  if (!user) {
    console.log('Invalid token - 403 - in Server '); // Log di debug
    return res.sendStatus(403);
  }
  console.log('User authorized:', user); // Log di debug
  req.user = user;
  next();
}); 

  

// update data into DB 
server.put('/userList/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const updateData = req.body;
  const db = readDB();
  const userIndex = db.usersList.findIndex(user => user.id===userId);
  

  if(userIndex === -1){
    console.log('User not found'); // Log di debug
    return res.status(404).json({error: 'User not found'});
  }

// Verifica se l'utente autenticato è lo stesso che sta cercando di aggiornare
if(req.user.email !== db.usersList[userIndex].email){
  console.log('Forbidden: User cannot update another user\'s data'); // Log di debug
  return res.sendStatus(403);
}

  const user = db.usersList[userIndex];
  user.name = updateData.name || user.name;
  user.surname = updateData.surname || user.surname;
  user.email = updateData.email || user.email;
  user.password = updateData.password || user.password;

   db.usersList[userIndex] = user;
   writeDB(db);
/** user e db.usersList[userIndex] dovrebbero contenere gli stessi dati, 
 * poiché user è stato aggiornato e poi riassegnato alla stessa posizione nell'array */
   console.log('User updated:', user);
   res.status(200).json(user);
   
  
}); 

// delete data from to DB 
server.delete('/userList/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const db = readDB();
  const userIndex = db.usersList.findIndex(user => user.id===userId);
  
  if(userIndex === -1){
    return res.status(404).json({error: 'User not found'});
  }

  const deletedUser = db.usersList.splice(userIndex, 1)[0];
  console.log("deletedUser: ", deletedUser); // Log di debug
  writeDB(db);
  res.status(200).json({ message: 'User deleted successfully', user: deletedUser });
});



// Get all users
server.get('/usersList', (req, res) => {
  const db = readDB();
  console.log('Reading from db.json', db.usersList); // Log per il debug
  return res.json(db.usersList);
});


// Use of router of json-server
server.use(router);
const port = process.env.PORT || 3000;

const listener = server.listen(port, () => {
  console.log(`JSON Server is running on port ${port}`);
});


// Graceful shutdown: 
/** Graceful Shutdown (arresto graduale) si riferisce al processo 
 * di spegnimento di un sistema o un servizio in modo ordinato e 
 * controllato, permettendo al sistema di completare le operazioni 
 * in corso e rilasciare risorse in modo appropriato. 
 * Questo evita la perdita di dati e garantisce che le operazioni 
 * siano completate correttamente. */
const gracefulShutdown = () => {
  console.log('Received kill signal, shutting down gracefully...');
  listener.close(() => {
    console.log('Closed out remaining connections');
    process.exit();
  });

  // Forza l'uscita se non si chiude entro 10 secondi
  setTimeout(() => {
    console.error('Could not close connections in time, forcefully shutting down');
    process.exit();
  }, 10000);
};

// Cattura i segnali di terminazione SIGTERM o SIGINT per iniziare il processo di spegnimento.
/** SIGINT (Interrupt Signal): Questo segnale viene inviato quando si preme Ctrl + C nel terminale in cui il processo è in esecuzione. */
/** SIGTERM (Terminate Signal): Può essere inviato utilizzando il comando kill dal terminale.
 * kill <PID> dove <PID> è l'ID del processo che si desidera terminare.
*/
// Cattura i segnali di terminazione SIGTERM o SIGINT per iniziare il processo di spegnimento.
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received.');
  gracefulShutdown();
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received.');
  gracefulShutdown();
});


