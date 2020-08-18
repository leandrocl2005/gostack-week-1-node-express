const express = require('express');
const { uuid, isUuid } = require('uuidv4');

const app = express();
app.use(express.json());

const projects = [];

function logRequests(request, response, next) {
  const { method, url } = request;
  const logLabel = `${method}`;
  console.time(logLabel);
  next();
  console.timeEnd(logLabel);
}

function validadeProjectId(request, response, next) {
  const { id } = request.params;
  if (!isUuid(id)) {
    return response.status(400).json({ error: 'Invalid id' });
  }
  return next();
}

app.use(logRequests);
// app.use('/projects/:id', validadeProjectId);

app.get('/projects', (req, res) => {
  const { title } = req.query;

  const results = title
    ? projects.filter(project => project.title.includes(title))
    : projects;
  return res.json(results);
});

app.post('/projects', (req, res) => {
  const { title, owner } = req.body;
  const project = {
    id: uuid(),
    title,
    owner,
  };
  projects.push(project);
  return res.json(project);
});

app.put('/projects/:id', validadeProjectId, (req, res) => {
  const { id } = req.params;
  const projectIndex = projects.findIndex(item => item.id === id);

  if (projectIndex < 0) {
    return res.status(400).json({ error: 'Not found!' });
  }

  const { title, owner } = req.body;

  const project = {
    id,
    title,
    owner,
  };

  projects[projectIndex] = project;

  return res.json(project);
});

app.delete('/projects/:id', validadeProjectId, (req, res) => {
  const { id } = req.params;
  const projectIndex = projects.findIndex(item => item.id === id);

  if (projectIndex < 0) {
    return res.status(400).json({ error: 'Not found!' });
  }

  projects.splice(projectIndex, 1);

  return res.status(204).send();
});

app.listen(3333, () => console.log('❤  Back-end started! ❤'));
