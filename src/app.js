const express = require("express");
const cors = require("cors");

const { v4: uuid, isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  let { title, url, techs} = request.body;
  let id = uuid();
  let repo = { id, title, url, techs, likes: 0 };
  repositories.push(repo);
  return response.status(201).json(repo);
});

app.put("/repositories/:id", (request, response) => {
  let { id } = request.params
  let { title, url, techs } = request.body;
  let index = repositories.findIndex( repo => repo.id == id);
  if (index >= 0) {
    let repo = repositories[index];
    if (title != null) { repo.title = title}
    if (url != null) { repo.url = url}
    if (techs != null) { repo.techs = techs}
    repositories[index] = repo;
    return response.status(200).json(repo);
  }
  return response.status(400).json({message: "Bad Request"});
});

app.delete("/repositories/:id", (request, response) => {
  let { id } = request.params
  let index = repositories.findIndex( repo => repo.id == id);
  if (index >= 0) {
    repositories.splice(index, 1);
    return response.status(204).json();
  }
  return response.status(400).json();
});

app.post("/repositories/:id/like", (request, response) => {
  let { id } = request.params
  let index = repositories.findIndex( repo => repo.id == id);
  if (index >= 0) {
    repo = repositories[index];
    repo.likes++
    return response.status(200).json(repo);
  }
  return response.status(400).json({message: "Bad Request"});
});

module.exports = app;
