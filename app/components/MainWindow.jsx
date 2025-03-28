"use client";
import React, { useState } from "react";
import Entry from "./Entry";
import dynamic from "next/dynamic";

const YearChart = dynamic(() => import("./YearChart"), { ssr: false });
const RatingChart = dynamic(() => import("./RatingChart"), { ssr: false });
const CategoryChart = dynamic(() => import("./CategoryChart"), { ssr: false });

export default function MainWindow({games, totalGames, allGames, onNewEntry, onEdit, onDelete, searchTerm, sortOption, currentPage, itemsPerPage, onSearchChange, onSortChange, onPageChange }) 
{
  const totalPages = Math.ceil(totalGames / itemsPerPage) || 1;
  const highestRating = allGames.length > 0 ? Math.max(...allGames.map((game) => game.rating)) : 0;
  const lowestRating = allGames.length > 0 ? Math.min(...allGames.map((game) => game.rating)) : 0;

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
          onChange={(e) => onSearchChange(e.target.value)}
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
          onChange={(e) => onSortChange(e.target.value)}
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
          {games.map((game) => (
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
        <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} aria-label="prev" style={{ padding: "0.5rem",
            fontSize: "1.1rem",
            fontFamily: 'Lemonada',
            borderRadius: "20px",
            border: "1px solid #ccc", }}>
          Prev
        </button>
        <span style={{ margin: "0 1rem" }}>
          Page {currentPage} of {totalPages}
        </span>
        <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} aria-label="next" style={{ padding: "0.5rem",
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
          <YearChart games={allGames} />
        </div>
        <div
          style={{
            flex: 1,
            backgroundColor: 'white',
            padding: '1rem',
            borderRadius: '8px',
          }}
        >
          <RatingChart games={allGames} />
        </div>
        <div
          style={{
            flex: 1,
            backgroundColor: 'white',
            padding: '1rem',
            borderRadius: '8px',
          }}
        >
          <CategoryChart games={allGames} />
        </div>
      </div>
      
    </div>

    
  );
}
