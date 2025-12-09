import React from "react";

const Search = ({searchTerm, setSearchTerm, isSticky = false}) =>{
    return(
        <div className={`search ${isSticky?`sticky-search`:``}`}>
            <div>
                <img src="search.svg" alt="search" />
                <input
                 type="text" 
                 placeholder="Search through Thousands of movies"
                 value={searchTerm}
                 onChange={(event) => setSearchTerm(event.target.value)}
                />
            </div>
        </div>
    )
}

export default Search