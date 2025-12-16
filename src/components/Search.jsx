import React from "react";
import searchIcon from '../assets/search.svg';

const Search = ({searchTerm, setSearchTerm, isSticky = false}) =>{
    return(
        <div className={`search ${isSticky?`sticky-search`:``}`}>
            <div>
                <img src={searchIcon} alt="search" />
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