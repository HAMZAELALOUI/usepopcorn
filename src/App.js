import { useEffect, useState } from "react";
import StarRating from './StarRating'

const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);
  // const KEY="f84fc31d";
  const KEY="d658538d";
  const tempQuery="Interstellar"

export default function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading,setIsLoading]=useState(false)
  const [error,setError]=useState("")
  const [selectedId,setSelectedId]=useState(null)

  function handleSelectedMovie(id){
    setSelectedId(selectedId=>id ===selectedId ? null : id)
   }
   function handleCloseMovie(){
    setSelectedId(null)
   }
     
   function handleAddWatched(movie){
    setWatched(watched=>[...watched, movie])
   }
  function handleDeleteWatched(id){
    setWatched(watched=>watched.filter(movie=>movie.imdbID !== id))
  }
  

  useEffect(
    function(){
      const controller= new AbortController()
      async function fetchMovies(){
        try{
        setIsLoading(true);
        setError('')

      const res=await fetch(`http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,{signal:controller.signal}) ;
      if(!res.ok) throw new Error ("Please check your network ...");

        const data =await res.json();
        if (data.Response === "False") throw new Error("Movie not found");
        setMovies(data.Search)
        setError("")
      } catch (err){
        console.error(err.message)
        if(err.name!== 'AbortError'){
          setError(err.message)

        }

      }finally{
        setIsLoading(false)
      }}
      if(query.length<0){
        setIsLoading([]);
        setError("");
        return;
      }
    fetchMovies()
  return function(){
    controller.abort()
  } },[query])


        
 
  
  return (
    <>
      <NavBar>
        <Search query={query} setQuery={setQuery}/>
        <NumResults movies={movies} />
      </NavBar>
      <Main>
        <Box>
         {/* {
         isLoading ? <p className="loader">Loading ...</p>: <MovieList movies={movies} />
         }  */}
         {isLoading && <Loader/>}
         {!isLoading && !error &&( <MovieList
          movies={movies} 
          onSelectedMovie={handleSelectedMovie}
         />)}
         {error && <ErrorMessage message={error}/>}
        </Box>
        <Box>
          {  
          selectedId ? <MovieDetails 
          selectedId={selectedId}
          onCloseMovie={handleCloseMovie}  
          onAddWatched={handleAddWatched} 
          watched={watched}
            /> :
              <>
             <WatchedSummary watched={watched} />
              <WatchedMoviesList watched={watched} onDeleteWatched={handleDeleteWatched} />
               </>
          }
        </Box>
      </Main>
    </>
  );
}
function MovieDetails({selectedId ,onCloseMovie,onAddWatched,watched}){
 const [movie,setMovie]=useState({})
 const [isLoading,setIsLoading]=useState(false)
 const [userRating,setUserRating]=useState("");
 const{
  Title:title,
  Year:year,
  Poster:poster,
  Runtime:runtime,
  imdbRating,
  Plot:plot,
  Released:released,
  Actors:actors,
  Director:director,
  Genre:genre,
 }=movie

 const isWatched=watched.map(movie=>movie.imdbID).includes(selectedId);
 const WatchedUserRating=watched.find(movie=>movie.imdbID===selectedId)?.userRating;

  function handleAdd(){
    const newWatchedMovie={
      imdbID:selectedId,
      title,
      year,
      poster,
      imdbRating:Number(imdbRating),
      runtime:Number(runtime.split(" ").at(0)),
      userRating,
    }
    onAddWatched(newWatchedMovie)
    onCloseMovie()
  }
  useEffect(
    function(){

   async function getMovieDetails(){
    setIsLoading(true)
    const res=await fetch(`http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`) ;
    const data =await res.json()
    setMovie(data)
    setIsLoading(false)
    }
    getMovieDetails();
  },[selectedId]
  )

  useEffect(
    function(){
      if(!title) return;
      document.title=`Movie | ${title}`
     return function (){
      document.title="usePopCorn"
         
      }
    },[title]
  )
  return <div className="details">
    {isLoading ? <Loader/> :
      <>
    <header>
    <button className="btn-back" onClick={onCloseMovie}>&larr;</button>
    <img src={poster} alt={`poster of ${movie}`}/>
    <div className="details-overview">
      <h1>{title}</h1>
      <p>{released} &bull; {runtime}</p>
      <p>{genre}</p>
      <p>⭐{imdbRating} IMDb Rating</p>
    </div>
    </header>
    <section>
      <div className="rating">
    { 
      !isWatched ?
      <>
     <StarRating maxRating={10} size={24} onSetRating={setUserRating}/>
      {userRating > 0 && <button 
      className="btn-add"
      onClick={handleAdd}>
        + Add To List
        </button>} 
         </>
         :
        <p>You Rated This Movie {WatchedUserRating} <span>🌟</span></p>
      }
       </div>
      <p><em>{plot}</em></p>
      <p>Staring {actors}</p>
      <p>Directed by {director}</p>
    </section>
    </>
    }
  </div>
}
function ErrorMessage({message}){
  return(
    <p className="error"><span>😫</span>{message}</p>
  )
}
function Loader(){
  return (
    <p className="loader">Loading ...</p>
  )
}
function NavBar({ children }) {
  return (
    <nav className="nav-bar">
      <Logo />
      {children}
    </nav>
  );
}
function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}
function Search({query,setQuery}) {

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}

function NumResults({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}

// function WatchedBox() {
//   const [watched, setWatched] = useState(tempWatchedData);
//   const [isOpen2, setIsOpen2] = useState(true);

//   return (
//     <div className="box">
//       <button
//         className="btn-toggle"
//         onClick={() => setIsOpen2((open) => !open)}
//       >
//         {isOpen2 ? "–" : "+"}
//       </button>
//       {isOpen2 && (
//         <>
//           <WatchedSummary watched={watched} />
//           <WatchedMoviesList watched={watched} />
//         </>
//       )}
//     </div>
//   );
// }
function MovieList({ movies ,onSelectedMovie}) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie movie={movie} key={movie.imdbID} onSelectedMovie={onSelectedMovie}/>
      ))}
    </ul>
  ); 
}
function Movie({ movie,onSelectedMovie }) {
  return (
    <li onClick={()=>onSelectedMovie(movie.imdbID)} >
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

function WatchedSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime.toFixed(0)} min</span>
        </p>
      </div>
    </div>
  );
}
function WatchedMoviesList({ watched,onDeleteWatched }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie movie={movie} key={movie.imdbID} onDeleteWatched={onDeleteWatched} />
      ))}
    </ul>
  );
}

function WatchedMovie({ movie,onDeleteWatched }) {
  return (
    <li>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
        <button className="btn-delete" onClick={()=>onDeleteWatched(movie.imdbID)}>X</button>
      </div>
    </li>
  );
}
