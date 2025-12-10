import React from 'react';

const TrendCard = ({trendingMovies}) => {
  
  if (!trendingMovies || trendingMovies.length === 0) {
    return null;
  }

  const cards = trendingMovies.slice(0, 3).map((movie) => ({
    id: movie.$id,
    image: movie.poster_url,
    title: movie.title,
  }));

  const customOrder = [1, 0, 2];
  const orderedCards = customOrder.map(idx => cards[idx]);

  return (
    <div className="flex items-center justify-center p-8 my-8">
      <div className="relative w-full max-w-[800px] h-[350px] flex items-center justify-center">
        {orderedCards.map((card, index) => {
          
          const rotations = [-20, 0, 20]; 
          const translateX = [-120, 0, 120]; 
          const zIndex = index === 1 ? 30 : index === 0 ? 10 : 20;
          
          return (
            <div
              key={card.id}
              className="absolute transition-all duration-500 hover:scale-105 cursor-pointer"
              style={{
                transform: `translateX(${translateX[index]}px) rotate(${rotations[index]}deg)`,
                zIndex: zIndex,
              }}
            >
              <div className="w-[280px] h-[380px] rounded-xl overflow-hidden shadow-2xl border border-white bg-white">
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div 
                className="absolute inset-0 bg-black/50 rounded-xl -z-10 blur-2xl"
                style={{
                  transform: 'translateY(30px) scale(0.9)'
                }}
              ></div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TrendCard;