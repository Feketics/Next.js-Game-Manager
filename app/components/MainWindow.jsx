"use client";
import React, { useState } from "react";
import Entry from "./Entry";
import dynamic from "next/dynamic";

const YearChart = dynamic(() => import("./YearChart"), { ssr: false });
const RatingChart = dynamic(() => import("./RatingChart"), { ssr: false });
const CategoryChart = dynamic(() => import("./CategoryChart"), { ssr: false });

export default function MainWindow({ games, onNewEntry, onEdit, onDelete }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("name-asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const filteredGames = games.filter((game) => {
    const term = searchTerm.toLowerCase();
    return (
      game.name.toLowerCase().includes(term) ||
      game.category.toLowerCase().includes(term)
    );
  });

  const sortedGames = filteredGames.sort((a, b) => {
    const [key, direction] = sortOption.split("-");
    let comparison = 0;

    if (key === "rating") 
    {
      comparison = Number(a.rating) - Number(b.rating);
    } 
    else if (key === "year") 
    {
      const yearA = new Date(a.datePublished).getFullYear();
      const yearB = new Date(b.datePublished).getFullYear();
      comparison = yearA - yearB;
    } 
    else 
    {
      const valA = a[key].toLowerCase();
      const valB = b[key].toLowerCase();
      if (valA < valB) 
      {
        comparison = -1;
      } 
      else if (valA > valB) 
      {
        comparison = 1;
      } 
      else 
      {
        comparison = 0;
      }
    }

    return direction === "asc" ? comparison : -comparison;
  });

  const highestRating = games.length > 0 ? Math.max(...games.map((game) => game.rating)) : 0;
  const lowestRating = games.length > 0 ? Math.min(...games.map((game) => game.rating)) : 0;

  const totalPages = Math.ceil(sortedGames.length / itemsPerPage);
  
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentGames = sortedGames.slice(startIndex, startIndex + itemsPerPage);

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };
  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <div
      style={{
        backgroundColor: "#60CA9F",
        padding: "4rem",
        minHeight: "100vh",
      }}
    >
      <div 
      style={{ 
        display: "flex", 
        alignItems: "center", 
        marginBottom: "1rem",
        }}>
        {/* Search bar */}
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            flex: 1,
            padding: "0.5rem",
            fontSize: "1.1rem",
            fontFamily: 'Lemonada',
            borderRadius: "20px",
            border: "1px solid #ccc",
          }}
        />
        {/* New Entry button */}
        <button
          onClick={onNewEntry}
          aria-label="NewEntry"
          style={{
            marginLeft: "1rem",
            padding: "0.5rem 1rem",
            border: "none",
            borderRadius: "20px",
            fontFamily: 'Lemonada',
            fontSize: "1.1rem",
            backgroundColor: "#fff",
            cursor: "pointer",
          }}
        >
          <strong>New Entry</strong>
        </button>
      </div>
      
      {/* Sort dropdown */}
      <div 
        style={{ 
          marginBottom: "1rem",
          fontSize: "1.1rem",
        }}>
          
        <label htmlFor="sortSelect"><strong>Sort By:</strong></label>
        <select
          id="sortSelect"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          style={{ 
            marginLeft: "0.5rem", 
            padding: "0.3rem",
            fontFamily: 'Lemonada',
            borderRadius: "15px",
          }}
        >
          <option value="name-asc">Name (Asc)</option>
          <option value="name-desc">Name (Desc)</option>
          <option value="rating-asc">Rating (Asc)</option>
          <option value="rating-desc">Rating (Desc)</option>
          <option value="category-asc">Category (Asc)</option>
          <option value="category-desc">Category (Desc)</option>
          <option value="datePublished-asc">date Published (Asc)</option>
          <option value="datePublished-desc">date Published (Desc)</option>
        </select>
      </div>

      {/* Game list */}
      <div
        style={{
          backgroundColor: "#fff",
          padding: "1rem",
          borderRadius: "25px",
        }}>
        <div>
          {currentGames.map((game) => (
            <Entry
              key={game.id}
              game={game}
              onEdit={() => onEdit(game)}
              onDelete={() => onDelete(game)}
              isHighest={game.rating === highestRating}
              isLowest={game.rating === lowestRating}
            />
          ))}
        </div>
      </div>

      {/* Pagination Controls */}
      <div style={{ marginTop: "1rem", textAlign: "center" }}>
        <button onClick={handlePrevPage} disabled={currentPage === 1} aria-label="prev" style={{ padding: "0.5rem",
            fontSize: "1.1rem",
            fontFamily: 'Lemonada',
            borderRadius: "20px",
            border: "1px solid #ccc", }}>
          Prev
        </button>
        <span style={{ margin: "0 1rem" }}>
          Page {currentPage} of {totalPages}
        </span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages} aria-label="next" style={{ padding: "0.5rem",
            fontSize: "1.1rem",
            fontFamily: 'Lemonada',
            borderRadius: "20px",
            border: "1px solid #ccc", }}>
          Next
        </button>
      </div>

      {/* Data Charts Section */}
      <div
        style={{
          marginTop: '2rem',
          display: 'flex',
          gap: '1rem',
        }}
      >
        <div
          style={{
            flex: 1,
            backgroundColor: 'white',
            padding: '1rem',
            borderRadius: '8px',
          }}
        >
          <YearChart games={games} />
        </div>
        <div
          style={{
            flex: 1,
            backgroundColor: 'white',
            padding: '1rem',
            borderRadius: '8px',
          }}
        >
          <RatingChart games={games} />
        </div>
        <div
          style={{
            flex: 1,
            backgroundColor: 'white',
            padding: '1rem',
            borderRadius: '8px',
          }}
        >
          <CategoryChart games={games} />
        </div>
      </div>
      
    </div>

    
  );
}
