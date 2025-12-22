import React, { useEffect, useState } from "react";
import starIcon from "../assets/star.svg";

const WatchListCard = ({
  movie: {
    id,
    title,
    poster_path,
    vote_average,
    original_language,
    release_date,
    overview,
  },
  watchListId = [],
  setWatchListId,
}) => {
  const [isActive, setIsActive] = useState(
    Array.isArray(watchListId) && watchListId.includes(id),
  );
  useEffect(() => {
    setIsActive(Array.isArray(watchListId) && watchListId.includes(id));
  }, [watchListId, id]);

  const handleBookmarkClick = () => {
    setIsActive(!isActive);
    if (!isActive) {
      setWatchListId((prev) => {
        if (Array.isArray(prev) && prev.includes(id)) return prev;
        return [...prev, id];
      });
    } else {
      setWatchListId((prev) =>
        Array.isArray(prev) ? prev.filter((movieId) => movieId !== id) : [],
      );
    }
  };

  if (!poster_path) {
    return null;
  }

  const btn_bookmark = `btn-bookmark ${
    isActive
      ? "bg-light-100/20 border-light-100/40"
      : "bg-gray-700 border-light-100/20"
  }`;

  return (
    <div className="card-container">
      <div className="movie-card">
        <img
          className="poster-img"
          src={
            poster_path
              ? `https://image.tmdb.org/t/p/w500/${poster_path}`
              : `/no-movie.png`
          }
          alt={title}
        />

        <div className="movie-info">
          <div className="info-header">
            <h3>{title}</h3>

            <button
              className={btn_bookmark}
              aria-label="Add to watchListId"
              onClick={() => handleBookmarkClick()}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill={isActive ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
            </button>
          </div>

          <div className="content">
            <div className="rating">
              <img src={starIcon} alt="Star Icon" />
              <p>{vote_average ? vote_average.toFixed(1) : "N/A"}</p>
            </div>
            <span>•</span>
            <p className="lang">{original_language}</p>
            <span>•</span>
            <p className="year">
              {release_date ? release_date.split("-")[0] : "N/A"}
            </p>
          </div>
        </div>

        <div className="card-details">
          <div className="description">
            <h4>Overview</h4>
            <p>
              {overview
                ? overview.length > 150
                  ? overview.substring(0, 150) + "..."
                  : overview
                : "No description available."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WatchListCard;
