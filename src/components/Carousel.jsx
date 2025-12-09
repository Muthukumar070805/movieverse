import React from "react";

const Carousel = ({ pageNumber, setPageNumber, onPageHandle, isLoading }) => {
  const increment = () => {
    if (!isLoading) {
      const num = pageNumber+1;
      setPageNumber(num);
      onPageHandle(num);
    }
  };
  const decrement = () => {
      if (!isLoading && pageNumber > 1){
        const num = pageNumber-1;
        setPageNumber(num);
        onPageHandle(num);
      } 

  };

  return (
    <div className="carousel">
      <button onClick={() => decrement()}><a>Previous</a></button>
      <span>{pageNumber}</span>
      <button onClick={() => increment()}><a>Next</a></button>
    </div>
  );
};

export default Carousel;
