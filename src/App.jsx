import React, { useRef } from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useDebounce } from "react-use";
import {
  Search,
  Spinner,
  Moviecard,
  Carousel,
  TrendCard,
  GenreFilter,
  Bookmark,
  WatchListCard,
} from "./components";
import { updateSearchCount } from "./appwrite";

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

  const [isSearchSticky, setIsSearchSticky] = useState(false);

  const [genreList, setGenreList] = useState([]);

  const [selectedGenres, setSelectedGenres] = useState("");

  const [isBookmarked, setIsBookmarked] = useState(false);

  const [watchList, setWatchList] = useState([]);

  const [watchListId, setWatchListId] = useState(() => {
    try {
      const saved = localStorage.getItem("watchListId");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useDebounce(() => setDebouncedSearchTearm(searchTerm), 500, [searchTerm]);

  const headerRef = useRef(null);

  const fetchGenres = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/genre/movie/list`,
        API_OPTIONS,
      );
      if (response.status !== 200) {
        throw new Error(`Failed to fetch genres: ${response.status}`);
      }
      setGenreList(response.data.genres);
      // console.log(response.data.genres);`
    } catch (error) {
      console.error(error);
    }
  };

  const fetchMoviesByIds = async () => {
    setIsLoading(true);
    setErrorMessage("");
    watchListId.forEach(async (id) => {
      try {
        const response = await axios.get(`${API_URL}/movie/${id}`, API_OPTIONS);
        if (response.status !== 200) {
          throw new Error(`Failed to fetch movie details: ${response.status}`);
        }

        // Check if the movie is already in the watchList
        if (!watchList.some((movie) => movie.id === id)) {
          setWatchList((prevWatchList) => [...prevWatchList, response.data]);
          console.log(watchList);
        }
      } catch (err) {
        console.error(`Error Fetching movies: ${err}`);
        setErrorMessage(`Error Fetching Movies Please Try again Later...`);
      } finally {
        setIsLoading(false);
      }
    });
  };

  // const fetchMoviesByIds = async () => {
  //   setIsLoading(true);
  //   setErrorMessage("");
  //     const uniqueMovieIds = new Set();
  //   watchListId.forEach(async (id) => {
  //     try {
  //       const response = await axios.get(`${API_URL}/movie/${id}`, API_OPTIONS);
  //       if (response.status !== 200) {
  //         throw new Error(`Failed to fetch movie details: ${response.status}`);
  //       }

  //       // console.log(response.data);
  //       const data = response.data;

  //       setWatchList((prevWatchList) => [...prevWatchList, data]);
  //       console.log(watchList);
  //     } catch (err) {
  //       console.error(`Error Fetching movies: ${err}`);
  //       setErrorMessage(`Error Fetching Movies Please Try again Later...`);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   });
  // };

  const fetchMovies = async (
    query = searchTerm || "",
    page = 1,
    genre = selectedGenres || "",
  ) => {
    setIsLoading(true);
    setErrorMessage("");
    let endpoint;
    try {
      const params = new URLSearchParams({
        ...(query && { query: query }),
        ...(genre && { with_genres: genre }),
        page: page,
      });

      if (query && genre) {
        endpoint = `${API_URL}/search/movie?${params.toString()}`;
      } else if (query) {
        endpoint = `${API_URL}/search/movie?${params.toString()}`;
      } else if (genre && !query) {
        endpoint = `${API_URL}/discover/movie?sort_by=popularity.desc&with_genres=${genre}&page=${page}`;
      } else {
        endpoint = `${API_URL}/discover/movie?sort_by=popularity.desc&page=${page}`;
      }
      // console.log(endpoint);
      const response = await axios.get(endpoint, API_OPTIONS);

      if (response.status !== 200) {
        throw new Error(`Failed to fetch movies: ${response.status}`);
      }

      const data = response.data;
      // console.log(data.results);

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
    setPageNumber(1);
    fetchMovies(debouncedSearchTearm, 1, selectedGenres);
  }, [debouncedSearchTearm]);

  useEffect(() => {
    fetchMovies(searchTerm, 1, selectedGenres);
  }, [selectedGenres]);

  useEffect(() => {
    loadTrendingMovies();
    fetchGenres();
  }, []);

  useEffect(() => {
    localStorage.setItem("watchListId", JSON.stringify(watchListId));
    // fetchMoviesByIds();
  }, [watchListId]);

  useEffect(() => {
    if (isBookmarked) {
      fetchMoviesByIds();
    } else if (!isBookmarked) {
      fetchMovies(debouncedSearchTearm, pageNumber, selectedGenres);
    }
  }, [isBookmarked]);

  useEffect(() => {
    const handleScroll = () => {
      if (headerRef.current) {
        const headerBottom = headerRef.current.getBoundingClientRect().bottom;
        const scrollThreshold = headerBottom + 750;

        setIsSearchSticky(window.scrollY > scrollThreshold);
      }
    };

    window.addEventListener("scroll", handleScroll);

    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <main>
      <div className="pattern" />

      <div className="wrapper">
        <header ref={headerRef}>
          <TrendCard trendingMovies={trendingMovies} />
          <h1>
            Find <span className="text-gradient"> Movies</span> You'll Enjoy
            Without the Hassle
          </h1>

          <div className="flex items-center justify-center gap-6 mt-10">
            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            <GenreFilter
              genreList={genreList}
              setSelectedGenres={setSelectedGenres}
            />

            <Bookmark
              isBookmarked={isBookmarked}
              setIsBookmarked={setIsBookmarked}
              watchListId={watchListId}
            />
          </div>
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
            <p className="text-red-500" onClick={() => fetchMovies("")}>
              {errorMessage}
            </p>
          ) : isBookmarked ? (
            <ul>
              {watchList.map((movie) => (
                <WatchListCard
                  key={movie.id}
                  movie={movie}
                  watchListId={watchListId}
                  setWatchListId={setWatchListId}
                  isBookmarked={isBookmarked}
                  setIsBookmarked={setIsBookmarked}
                  watchList={watchList}
                  setWatchList={setWatchList}
                />
              ))}
            </ul>
          ) : (
            <ul>
              {movieList.map((movie) => (
                <Moviecard
                  key={movie.id}
                  movie={movie}
                  watchListId={watchListId}
                  setWatchListId={setWatchListId}
                  isBookmarked={isBookmarked}
                  setIsBookmarked={setIsBookmarked}
                  watchList={watchList}
                  setWatchList={setWatchList}
                />
              ))}
            </ul>
          )}
        </section>

        {!isLoading ? (
          <Carousel
            pageNumber={pageNumber}
            setPageNumber={setPageNumber}
            onPageHandle={onPageHandle}
            isLoading={isLoading}
          />
        ) : null}
      </div>
    </main>
  );
}

export default App;
