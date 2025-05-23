"use client";
import React, { useState, useEffect } from "react";

export default function EditWindow({ game, onClose, onSubmit, errorMessage }) 
{
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [publisher, setPublisher] = useState("");
  const [datePublished, setDatePublished] = useState("");
  const [rating, setRating] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => 
  {
    if (game) 
    {
      setName(game.name || "");
      setDescription(game.description || "");
      setPublisher(game.publisher || "");
      setDatePublished(game.datePublished || "");
      setRating(game.rating || "");
      setCategory(game.category || "");
    }
  }, [game]);
  
  const handleSubmit = () => 
  {
    const updatedGame = 
    {
      id: game?.id,
      name,
      description,
      publisher,
      datePublished,
      rating: Number(rating),
      category,
    };
    onSubmit(updatedGame);
  };

  const [hasMounted, setHasMounted] = useState(false);
  
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
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          backgroundColor: "#60CA9F",
          padding: "1rem",
          borderRadius: "25px",
          minWidth: "300px",
        }}
      >
        <h2>{game ? "Edit Game" : "New Game"}</h2>
        <div style={{
          backgroundColor: '#D9D9D9',
          padding: "2rem",
          borderRadius: "25px",
          maxWidth: "600px",
        }}>
          <label>
            Game Name:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: "100%", marginBottom: "0.5rem", fontFamily: 'Lemonada', }}
            />
          </label>
          <label>
            Description:
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ width: "100%", marginBottom: "0.5rem", fontFamily: 'Lemonada', }}
            />
          </label>
          <label>
            Publisher:
            <input
              type="text"
              value={publisher}
              onChange={(e) => setPublisher(e.target.value)}
              style={{ width: "100%", marginBottom: "0.5rem", fontFamily: 'Lemonada', }}
            />
          </label>
          <label>
            Date Published:
            <input
              type="date"
              value={datePublished}
              onChange={(e) => setDatePublished(e.target.value)}
              style={{ width: "100%", marginBottom: "0.5rem", fontFamily: 'Lemonada', }}
            />
          </label>
          <label>
            Rating:
            <input
              type="number"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              style={{ width: "100%", marginBottom: "0.5rem", fontFamily: 'Lemonada', }}
            />
          </label>
          <label>
            Category:
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{ width: "100%", marginBottom: "0.5rem", fontFamily: 'Lemonada', }}
            />
          </label>

          {errorMessage && (
          <div style={{ color: "red", marginBottom: "0.5rem" }}>
            {errorMessage}
          </div>
          )}
        </div>

        <div style={{ 
          display: "flex",
          justifyContent: "space-between",
          padding: "1rem",
          }}>
          <button onClick={onClose} 
          style={{
            marginLeft: "1rem",
            padding: "0.5rem 1.2rem",
            border: "none",
            borderRadius: "20px",
            fontFamily: 'Lemonada',
            fontSize: "1.1rem",
            backgroundColor: "#fff",
            cursor: "pointer",
          }}>
            <strong>Cancel</strong>
          </button>
          <button onClick={handleSubmit} aria-label="Done"
          style={{
            marginLeft: "1rem",
            padding: "0.5rem 1.7rem",
            border: "none",
            borderRadius: "20px",
            fontFamily: 'Lemonada',
            fontSize: "1.1rem",
            backgroundColor: "#fff",
            cursor: "pointer",
          }}><strong>Done</strong></button>
        </div>
      </div>
    </div>
  );
}
