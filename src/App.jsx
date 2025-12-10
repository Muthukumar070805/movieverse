import React, { useRef } from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useDebounce } from "react-use";
import { Search, Spinner, Moviecard } from "./components";
import { updateSearchCount } from "./appwrite";
import { Carousel } from "./components";
import { TrendCard } from "./components";

const API_KEY = import.meta.env.VITE_TMDB_KEY;
const API_URL = "https://api.themoviedb.org/3";
const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

function App() {
  const [searchTerm, setSearchTerm] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  const [movieList, setMovieList] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const [debouncedSearchTearm, setDebouncedSearchTearm] = useState("");

  const [trendingMovies, setTrendingMovies] = useState([]);

  const [pageNumber, setPageNumber] = useState(1);

  const [ isSearchSticky, setIsSearchSticky] = useState(false);

  const [ watchList, setWatchList] = useState(() => {
    try {
      const saved = localStorage.getItem('watchlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }); 
  
  console.log(watchList);
  useDebounce(() => setDebouncedSearchTearm(searchTerm), 500, [searchTerm]);

  const headerRef = useRef(null);

  const fetchMovies = async (query = searchTerm || "" , page = 1) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        ...(query && { query: query }),
        page: page,
      });

      const endpoint = query
        ? `${API_URL}/search/movie?${params.toString()}`
        : `${API_URL}/discover/movie?sort_by=popularity.desc&page=${page}`;
      const response = await axios.get(endpoint, API_OPTIONS);

      if (response.status !== 200) {
        throw new Error(`Failed to fetch movies: ${response.status}`);
      }

      const data = response.data;
      // console.log(data.results[0])

      if (!data.results || data.results.length === 0) {
        setErrorMessage("No movies found");
        setMovieList([]);
        return;
      }

      setMovieList(data.results || []);
      if (query && data.results.length) {
        await updateSearchCount(query.toLowerCase(), data.results[0]);
      }
    } catch (err) {
      console.error(`Error Fetching movies: ${err}`);
      setErrorMessage(`Error Fetching Movies Please Try again Later...`);
    } finally {
      setIsLoading(false);
    }
  };


  const loadTrendingMovies = async () => {
    try {
      const endpoint = `${API_URL}/movie/popular`;
      const response = await axios.get(endpoint, API_OPTIONS);
      const data = response.data;

      if (!data.results || data.results.length === 0) {
        return;
      }
      const movies = data.results.map((movie) => ({
        $id: movie.id,
        title: movie.title,
        poster_url: movie.poster_path
          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
          : null,
      }));

      setTrendingMovies(movies.slice(0, 5));
    } catch (error) {
      console.log(error);
    }
  };

  const onPageHandle = (newPage) => {
    fetchMovies(searchTerm, newPage);
  };
  
 
  // useEffect

  useEffect(() => {
    fetchMovies(debouncedSearchTearm);
    console.log(searchTerm);
    setPageNumber(1);
  }, [debouncedSearchTearm]);

  useEffect(() => {
    loadTrendingMovies();
  }, []);

  useEffect(()=>{
    localStorage.setItem('watchlist', JSON.stringify(watchList));
  },[watchList])

  useEffect(()=>{
    const handleScroll = ()=>{
      if(headerRef.current){
        const headerBottom = headerRef.current.getBoundingClientRect().bottom;
        const scrollThreshold = headerBottom+ 750;

        setIsSearchSticky(window.scrollY > scrollThreshold)
      }
    }

    window.addEventListener('scroll',handleScroll);

    handleScroll();

    return()=>{
      window.removeEventListener('scroll',handleScroll);
    }
  },[])

  return (
    <main>
      <div className="pattern" />

      <div className="wrapper">
        <header ref={headerRef}>
          <TrendCard trendingMovies={trendingMovies}/>
          <h1>
            Find <span className="text-gradient"> Movies</span> You'll Enjoy
            Without the Hassle
          </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        {isSearchSticky && !isLoading && (
          <div className="sticky-search-container">
            <Search
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              isSticky={true}
            />
          </div>
        )}

        {trendingMovies.length > 0 && (
          <section className="trending">
            <h2>Trending Movies</h2>
            <ul>
              {trendingMovies.map((movie, index) => (
                <li key={movie.$id}>
                  <p>{index + 1}</p>
                  <img src={movie.poster_url} alt={movie.title} />
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="all-movies">
          <h2>All Movies</h2>
          {isLoading ? (
            <Spinner />
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            <ul>
              {movieList.map((movie) => (
                <Moviecard 
                  key={movie.id} 
                  movie={movie} 
                  watchList={watchList}
                  setWatchList={setWatchList} 
                />
              ))}
            </ul>
          )}
        </section>
           
          { !isLoading ? ( <Carousel
          pageNumber={pageNumber}
          setPageNumber={setPageNumber}
          onPageHandle={onPageHandle}
          isLoading={isLoading}
        />) : null }
        

      </div>
    </main>
  );
}

export default App;
