"use client";
import React, { useState, useEffect, useRef, useContext } from "react";
import Entry from "./Entry";
import dynamic from "next/dynamic";
import { OfflineContext } from "../context/OfflineProvider";

const YearChart = dynamic(() => import("./YearChart"), { ssr: false });
const RatingChart = dynamic(() => import("./RatingChart"), { ssr: false });
const CategoryChart = dynamic(() => import("./CategoryChart"), { ssr: false });

export default function MainWindow({games, allGames, onNewEntry, onEdit, onDelete, searchTerm, sortOption, onSearchChange, onSortChange, hasMore, isLoading, onLoadMore }) 
{
  const highestRating = allGames.length > 0 ? Math.max(...allGames.map((game) => game.rating)) : 0;
  const lowestRating = allGames.length > 0 ? Math.min(...allGames.map((game) => game.rating)) : 0;
  const sentinelRef = useRef(null);
  const { isOnline, serverUp } = useContext(OfflineContext);
  const [retryCooldown, setRetryCooldown] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  
  useEffect(() => 
  {
    const observer = new IntersectionObserver(
      (entries) => 
      {
        if (
          entries[0].isIntersecting &&
          hasMore &&
          !isLoading &&
          isOnline &&
          serverUp &&
          !retryCooldown
        ) 
        {
          onLoadMore();
        }
      },
      { threshold: 0.5 } // Reduced threshold for earlier trigger
    );

    if (sentinelRef.current) observer.observe(sentinelRef.current);

    return () => 
    {
      if (sentinelRef.current) observer.unobserve(sentinelRef.current);
    };
  }, [hasMore, isLoading, onLoadMore, isOnline, serverUp, retryCooldown]);

  // Add error cooldown logic
  useEffect(() => 
  {
    if (!isOnline || !serverUp) 
    {
      setRetryCooldown(true);
      const timer = setTimeout(() => setRetryCooldown(false), 5000); // 5s cooldown
      return () => clearTimeout(timer);
    }
  }, [isOnline, serverUp]);

  useEffect(() => 
  {
    setHasMounted(true);
  }, []);
  // Before mounting, render null so SSR and client outputs match.
  if (!hasMounted) 
  {
    return null;
  }
  
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
          id="searchInput"
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
          <option value="publisher-asc">Publisher (Asc)</option>
          <option value="publisher-desc">Publisher (Desc)</option>
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
          maxHeight: "60vh", // Fixed height
          overflowY: "auto", // Enable vertical scrolling
          position: "relative",
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
        <div ref={sentinelRef} style={{ 
          height: "20px",
          visibility: hasMore ? "visible" : "hidden"
        }}>
          {isLoading && <span>Loading more games...</span>}
        </div>
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
