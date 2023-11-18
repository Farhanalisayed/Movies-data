const express = require('express')
const app = express()
app.use(express.json())

const sqlite3 = require('sqlite3')
const {open} = require('sqlite')
const path = require('path')
let db
let dbPath = path.join(__dirname, 'moviesData.db')
let initializeDBServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Server running and going beyond')
    })
  } catch (error) {
    console.log(`The Error:${error.message}`)
    process.exit(1)
  }
}

app.get('/movies/', async (request, response) => {
  const getMoviesQuery = `SELECT * 
  FROM movie
  order by movie_id;`
  const movies = await db.all(getMoviesQuery)
  response.send(movies)
})

app.post('/movies/', async (request, response) => {
  const moviesDetail = request.body
  const {directorId, movieName, leadActor} = moviesDetail

  const postMoviesQuery = `INSERT INTO 
  movie(director_id, movie_name, lead_actor)
  VALUES('${directorId}', '${movieName}', '${leadActor}');`
  await db.run(postMoviesQuery)
  response.send('Movie Successfully Added')
})

app.get('/movies/:movieId/', async (request, response) => {
  const {movieId} = request.params
  const getAMovieQuery = `SELECT * 
  FROM movie
  WHERE movie_id= '${movieId}';`
  const theMovie = await db.get(getAMovieQuery)
  response.send(theMovie)
})

app.put('/movies:movieId/', async (request, response) => {
  const {movieId} = request.params
  const updatedMovies = request.body
  const {directorId, movieName, leadActor} = updatedMovies

  const postMoviesQuery = `UPDATE movie 
  SET
  director_id ='${directorId}',
  movie_name= '${movieName}',
  lead_actor= '${leadActor}'
  WHERE movie_id =${movieId}
  ;`
  await db.run(updatedMovies)
  response.send('Movie Details Updated')
})

app.delete('/movies:movieId/', async (request, response) => {
  const {movieId} = request.params

  const deleteMoviesQuery = `DELETE FROM movie 
  WHERE movie_id = ${movieId};`
  await db.run(deleteMoviesQuery)
  response.send('Movie Removed')
})

app.get('/directors/', async (request, response) => {
  const getdirectorsQuery = `SELECT * 
  FROM director
  order by director_id;`
  const directors = await db.all(getdirectorsQuery)
  response.send(directors)
})

app.get('/directors/:directorId/movies/', async (request, response) => {
  const {directorId} = request.params
  const getdirectorMoviessQuery = `SELECT movie_name 
  FROM movie
  WHERE director_id =${directorId};`
  const directorsMovie = await db.all(getdirectorMoviessQuery)
  response.send(directorsMovie)
})

initializeDBServer()
