const express = require('express');

const server = express();

server.use(express.json()); // adiciona plugin do express para usar JSON

// Query params = ?teste=1
// Route params = /users/1
// Request body =  { "name": "Gustavo", "email": "me@here.com"}

// * Configura rota para receber Query params
// server.get('/teste', (req, res) => { // localhost:3000/teste?nome=Gus
//   const nome = req.query.nome;

//    return res.json({ message: `Hello ${nome}` });
// }) 

// * Configura rota para receber Route params
// server.get('/users/:id', (req, res) => { // localhost:3000/users/13654
//   const id = req.params.id;

//    return res.json({ message: `Buscando o usuario ${id}` });
// }) 

// * Configura rota para receber Request Body

// const users = ['Gustavo', 'Susana', 'Gisele'];

// server.get('/users/:index', (req, res) => { // localhost:3000/users/1
//   const { index } = req.params; // mesmo que const index = req.params.index

//    return res.json(users[index]);
// }) 

// ** CRUD - Create, Read, Update, Delete

const users = ['Gustavo', 'Susana', 'Gisele'];

server.use((req, res, next) => {
  console.time('Duration');
  console.log(`Metodo: ${req.method}; URL: ${req.url}`);

  next();

  console.timeEnd('Duration');
});

function checkUserExists(req, res, next) {
  if (!req.body.name) {
    return res.status(400).json({ error: 'User name is required' });
  }
  return next();
}

function checkUserInArray(req, res, next) {
  if (!users[req.params.index]) {
    return res.status(400).json({ error: 'User does not exist'});
  }

  return next();
}

server.get('/users', (req, res) => { //consulta todos usuarios
  return res.json(users);            // localhost:3000/users
});

server.get('/users/:index', checkUserInArray, (req, res) => { // localhost:3000/users/1
  const { index } = req.params; // mesmo que const index = req.params.index

   return res.json(users[index]);
});

// Rota para inserir novos usuarios

server.post('/users', (req, res) => { // POST - insere novos usuarios
  const { name } = req.body;

  users.push(name);

  return res.json(users);
});

// Rota para alteracao de usuario

server.put('/users/:index', checkUserInArray, checkUserExists, (req, res) => {
  const { index } = req.params; 
  const { name } = req.body; 

  users[index] = name;

  return res.json(users);
});

// Rota para excluir usuario, com deslocamento

server.delete('/users/:index', checkUserInArray, (req, res) => {
  const { index } = req.params;

  users.splice(index, 1);

  return res.json(users);
});

server.listen(3000);