import React from "react";

const GenreFilter = ({ genreList, setSelectedGenres }) => {
  const handleGenreClick = (event, genreId) => {
    event.preventDefault();
    setSelectedGenres(genreId);
  };

  return (
    <el-dropdown className="inline-block">
      <button className="inline-flex w-full justify-center gap-x-1.5 rounded-lg bg-light-100/5 px-4 py-3 text-sm font-semibold text-white inset-ring-1 inset-ring-white/5 hover:bg-white/20">
        Genre
        <svg
          viewBox="0 0 20 20"
          fill="currentColor"
          data-slot="icon"
          aria-hidden="true"
          className="-mr-1 size-5 text-gray-400"
        >
          <path
            d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
            clipRule="evenodd"
            fillRule="evenodd"
          />
        </svg>
      </button>

      <el-menu
        anchor="bottom end"
        popover="auto"
        className="w-30 origin-top-right rounded-md bg-gray-900/50 outline-1 -outline-offset-1 outline-white/10 transition transition-discrete [--anchor-gap:--spacing(2)] data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
      >
        <div className="py-1">
          <a
            key={null}
            href="#"
            onClick={(event) => handleGenreClick(event, null)}
            className="block px-4 py-2 text-sm text-gray-300 focus:bg-white/5 focus:text-white focus:outline-hidden"
          >
            Any
          </a>
          {genreList.slice(0, 5).map((genre) => (
            <a
              key={genre.id}
              href="#"
              onClick={(event) => handleGenreClick(event, genre.id)}
              className="block px-4 py-2 text-sm text-gray-300 focus:bg-white/5 focus:text-white focus:outline-hidden"
            >
              {genre.name}
            </a>
          ))}
        </div>
      </el-menu>
    </el-dropdown>
  );
};

export default GenreFilter;
