"use client";
import React from "react";

export default function Entry({ game, onEdit, onDelete, isHighest, isLowest }) 
{
  const publishYear = game.datePublished
    ? new Date(game.datePublished).getFullYear()
    : "Unknown";

  return (
    <div className="game-entry"
      style={{
        display: "flex",
        alignItems: "center",
        backgroundColor: isHighest ? "lightblue" : isLowest ? "#FFCCCB" : "#D9D9D9",
        marginBottom: "0.5rem",
        padding: "0.5rem",
        borderRadius: "20px",
        fontFamily: 'Lemonada',
        fontSize: "1.2rem",
      }}
    >
      <div style={{ flex: 1}}>
        <strong>{game.name}</strong> | {game.category} | Rating: {game.rating} | Published: {publishYear}
      </div>
      <div style={{ display: "flex", gap: "0.5rem" }}>
        {/* Edit button */}
        <button
          onClick={onEdit}
          aria-label="Edit"
          style={{
            border: "none",
            background: "#FFF",
            cursor: "pointer",
            borderRadius: "25px",
            padding: "0.3rem 0.5rem",
          }}
        >
          <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="30" height="30" rx="14" fill="white"/>
            <path fillRule="evenodd" clipRule="evenodd" d="M16.294 8.70592L18.75 6.24994L18.75 6.24994C19.7671 5.23289 20.2756 4.72436 20.8872 4.61154C21.1271 4.56731 21.373 4.56731 21.6128 4.61154C22.2244 4.72436 22.733 5.23288 23.75 6.24993L23.75 6.24994C24.7671 7.267 25.2756 7.77552 25.3884 8.38717C25.4326 8.627 25.4326 8.87289 25.3884 9.11271C25.2756 9.72436 24.7671 10.2329 23.75 11.2499L21.3218 13.6782C19.2384 12.4797 17.508 10.7623 16.294 8.70592ZM14.8397 10.1603L5.8564 19.1436C5.43134 19.5686 5.21881 19.7812 5.07907 20.0423C4.93934 20.3033 4.88039 20.5981 4.7625 21.1875L3.8971 25.5145C3.83058 25.8471 3.79732 26.0134 3.89193 26.108C3.98654 26.2026 4.15284 26.1694 4.48545 26.1029L8.81243 25.2375C9.40189 25.1196 9.69661 25.0606 9.95771 24.9209C10.2188 24.7812 10.4313 24.5686 10.8564 24.1436L19.8637 15.1363C17.8311 13.8735 16.1151 12.1693 14.8397 10.1603Z" fill="#222222"/>
          </svg>

        </button>

        {/* Delete button */}
        <button
          onClick={onDelete}
          aria-label="Delete"
          style={{
            border: "none",
            background: "#FFF",
            cursor: "pointer",
            borderRadius: "25px",
            padding: "0.3rem 0.5rem",
          }}
        >
          <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="30" height="30" rx="14" fill="white"/>
            <path fillRule="evenodd" clipRule="evenodd" d="M26.2501 7.5H3.75012V11.25C4.21478 11.25 4.4471 11.25 4.6403 11.2884C5.43368 11.4462 6.05388 12.0664 6.21169 12.8598C6.25012 13.053 6.25012 13.2853 6.25012 13.75V20.25C6.25012 23.0784 6.25012 24.4926 7.1288 25.3713C8.00748 26.25 9.42169 26.25 12.2501 26.25H17.7501C20.5785 26.25 21.9928 26.25 22.8714 25.3713C23.7501 24.4926 23.7501 23.0784 23.7501 20.25V13.75C23.7501 13.2853 23.7501 13.053 23.7886 12.8598C23.9464 12.0664 24.5666 11.4462 25.3599 11.2884C25.5531 11.25 25.7855 11.25 26.2501 11.25V7.5ZM12.8751 13.75C12.8751 13.1977 12.4274 12.75 11.8751 12.75C11.3228 12.75 10.8751 13.1977 10.8751 13.75V20C10.8751 20.5523 11.3228 21 11.8751 21C12.4274 21 12.8751 20.5523 12.8751 20V13.75ZM19.1251 13.75C19.1251 13.1977 18.6774 12.75 18.1251 12.75C17.5728 12.75 17.1251 13.1977 17.1251 13.75V20C17.1251 20.5523 17.5728 21 18.1251 21C18.6774 21 19.1251 20.5523 19.1251 20V13.75Z" fill="#222222"/>
            <path d="M12.5852 4.21324C12.7276 4.08034 13.0415 3.96291 13.4781 3.87915C13.9147 3.7954 14.4497 3.75 15 3.75C15.5503 3.75 16.0853 3.7954 16.5219 3.87915C16.9585 3.96291 17.2724 4.08034 17.4148 4.21324" stroke="#222222" strokeWidth="2" strokeLinecap="round"/>
          </svg>

        </button>
      </div>
    </div>
  );
}
