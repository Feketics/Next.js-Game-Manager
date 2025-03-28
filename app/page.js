"use client";
import React, { useEffect, useState } from "react";
import MainWindow from "./components/MainWindow";
import EditWindow from "./components/EditWindow";
import ConfirmationWindow from "./components/ConfirmationWindow";

export default function HomePage() 
{
  const [games, setGames] = useState([]);
  const [totalGames, setTotalGames] = useState(0);
  const [allGames, setAllGames] = useState([]);
  const [showEdit, setShowEdit] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [isNewEntry, setIsNewEntry] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("name-asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const fetchGames = async () => 
  {
    try 
    {
      const query = new URLSearchParams({
        search: searchTerm,
        sort: sortOption,
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
      });
      const res = await fetch(`/api/games?${query.toString()}`);
      const json = await res.json();
      setGames(json.data);
      setTotalGames(json.total);
      setAllGames(json.allData);
    } 
    catch (error) 
    {
      console.error("Error fetching games:", error);
    }
  };

  useEffect(() => {fetchGames();}, [searchTerm, sortOption, currentPage]);

  const handleNewEntry = () => 
  {
    setSelectedGame(null);
    setIsNewEntry(true);
    setShowEdit(true);
    setErrorMessage("");
  };

  const handleEdit = (game) => 
  {
    setSelectedGame(game);
    setIsNewEntry(false);
    setShowEdit(true);
    setErrorMessage("");
  };

  const handleDelete = (game) => 
  {
    setSelectedGame(game);
    setShowConfirmation(true);
  };

  const handleSearchChange = (term) => 
  {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleSortChange = (sort) => 
  {
    setSortOption(sort);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => 
  {
    setCurrentPage(page);
  };

  const handleEditSubmit = async (updatedGame) => 
  {
    try 
    {
      const endpoint = "/api/games";
      const method = isNewEntry ? "POST" : "PUT";
      const res = await fetch(endpoint, 
      {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedGame),
      });

      const json = await res.json();
      if (!res.ok) 
      {
        setErrorMessage(json.errors ? json.errors.join(" ") : json.error);
      } 
      else 
      {
        setShowEdit(false);
        setErrorMessage("");
        fetchGames();
      }
    } 
    catch (error) 
    {
      console.error("Error saving game:", error);
    }
  };

  const handleConfirmDelete = async () => 
  {
    try 
    {
      await fetch(`/api/games?id=${selectedGame.id}`, {method: "DELETE",});
      setShowConfirmation(false);
      setCurrentPage(1);
      fetchGames();
    } 
    catch (error) 
    {
      console.error("Error deleting game:", error);
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <MainWindow
        games={games}
        totalGames={totalGames}
        allGames={allGames}
        onNewEntry={handleNewEntry}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchTerm={searchTerm}
        sortOption={sortOption}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        onSearchChange={handleSearchChange}
        onSortChange={handleSortChange}
        onPageChange={handlePageChange}
      />
      {showEdit && (
        <EditWindow
          game={selectedGame}
          onClose={() => setShowEdit(false)}
          onSubmit={handleEditSubmit}
          errorMessage={errorMessage}
        />
      )}
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
