import React from "react";

const Bookmark = ({ isBookmarked, setIsBookmarked, watchListId }) => {
  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  return (
    <button
      className={`px-1 py-1 rounded-4xl bg-light-100/5 border border-light-100/20 text-white hover:bg-white/20 transition-colors duration-300 ${
        watchListId.length > 0 ? "text-light-100" : "hidden"
      }`}
      aria-label="View Watchlist"
      onClick={toggleBookmark}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill={isBookmarked ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="m-2 w-8 h-8"
      >
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      </svg>
    </button>
  );
};

export default Bookmark;
