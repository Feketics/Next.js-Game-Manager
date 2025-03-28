"use client";
import React, { useState } from "react";
import MainWindow from "./components/MainWindow";
import EditWindow from "./components/EditWindow";
import ConfirmationWindow from "./components/ConfirmationWindow";

export default function HomePage() 
{
  // Example hardcoded data
  const [games, setGames] = useState([
    {
      id: 1,
      name: "Factorio",
      description: "The Factory must grow!",
      publisher: "Publisher1",
      datePublished: "2023-01-01",
      rating: 8.5,
      category: "Strategy",
    },
    {
      id: 2,
      name: "Terraria",
      description: "Idk haven't played it.",
      publisher: "Publisher2",
      datePublished: "2023-11-01",
      rating: 8,
      category: "Rpg",
    },
    {
      id: 3,
      name: "Baldur's Gate 3",
      description: "The gate that belongs to Baldur or something.",
      publisher: "Publisher1",
      datePublished: "2024-07-18",
      rating: 8.75,
      category: "Rpg",
    },
    {
      id: 4,
      name: "Minecraft",
      description: "It's minecraft.",
      publisher: "Publisher2",
      datePublished: "2002-11-21",
      rating: 9,
      category: "Sandbox",
    },
    {
      id: 5,
      name: "League of Legends",
      description: "Rating given by the players, not me!",
      publisher: "Publisher3",
      datePublished: "2017-12-12",
      rating: 7,
      category: "Moba?",
    },
    {
      id: 6,
      name: "Stellaris",
      description: "Not for the faint of heart.",
      publisher: "Paradox",
      datePublished: "2023-01-01",
      rating: 7.95,
      category: "Strategy",
    },
  ]);

  // State for controlling popups
  const [showEdit, setShowEdit] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [isNewEntry, setIsNewEntry] = useState(false);

  // Handle "New Entry"
  const handleNewEntry = () => 
  {
    setSelectedGame(null);
    setIsNewEntry(true);
    setShowEdit(true);
  };

  // Handle "Edit"
  const handleEdit = (game) => 
  {
    setSelectedGame(game);
    setIsNewEntry(false);
    setShowEdit(true);
  };

  // Handle "Delete"
  const handleDelete = (game) => 
  {
    setSelectedGame(game);
    setShowConfirmation(true);
  };

  // Callback: user submitted the EditWindow
  const handleEditSubmit = (updatedGame) => 
  {
    if (isNewEntry) 
    {
      // Create new
      setGames((prev) => [...prev, { ...updatedGame, id: Date.now() }]);
    } 
    else 
    {
      // Update existing
      setGames((prev) =>
        prev.map((g) => (g.id === updatedGame.id ? updatedGame : g))
      );
    }
    setShowEdit(false);
  };

  // Callback: user confirmed deletion
  const handleConfirmDelete = () => 
  {
    setGames((prev) => prev.filter((g) => g.id !== selectedGame.id));
    setShowConfirmation(false);
  };

  return (
    <div style={{ position: "relative" }}>
      <MainWindow
        games={games}
        onNewEntry={handleNewEntry}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Edit Popup */}
      {showEdit && (
        <EditWindow
          game={selectedGame}
          onClose={() => setShowEdit(false)}
          onSubmit={handleEditSubmit}
        />
      )}

      {/* Confirmation Popup */}
      {showConfirmation && (
        <ConfirmationWindow
          message="Are you sure you want to delete this game?"
          onConfirm={handleConfirmDelete}
          onCancel={() => setShowConfirmation(false)}
        />
      )}
    </div>
  );
}
