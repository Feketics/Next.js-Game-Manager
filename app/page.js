"use client";
import React, { useEffect, useState, useCallback } from "react";
import MainWindow from "./components/MainWindow";
import EditWindow from "./components/EditWindow";
import ConfirmationWindow from "./components/ConfirmationWindow";
import { enqueueOperation } from "./lib/localQueue";
import { isServerAvailable } from "./lib/serverCheck";

export default function HomePage() 
{
  const [games, setGames] = useState([]);
  const [allGames, setAllGames] = useState([]);
  const [showEdit, setShowEdit] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [isNewEntry, setIsNewEntry] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("name-asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const itemsPerPage = 6;

  const fetchGames = useCallback(async () => 
  {
    try 
    {
      setIsLoading(true);
      const query = new URLSearchParams({
        search: searchTerm,
        sort: sortOption,
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
      });
      const res = await fetch(`/api/games?${query.toString()}`);
      const json = await res.json();
      
      setGames(prev => {
        const newGames = currentPage === 1 ? json.data : [...prev, ...json.data];
        setHasMore(newGames.length < json.total);
        return newGames;
      });
      setAllGames(json.allData);
    } 
    catch (error) 
    {
      console.error("Error fetching games:", error);
    } 
    finally 
    {
      setIsLoading(false);
    }
  }, [searchTerm, sortOption, currentPage]);

  useEffect(() => 
  {
    fetchGames();
  }, [fetchGames]);

  const handleLoadMore = () => 
  {
    if (hasMore && !isLoading) 
    {
      setCurrentPage(prev => prev + 1);
    }
  };

  useEffect(() => 
  {
    const handleSyncComplete = () => 
    {
      console.log("Sync complete event received; refreshing games.");
      fetchGames();
    };

    window.addEventListener("syncComplete", handleSyncComplete);
    return () => 
    {
      window.removeEventListener("syncComplete", handleSyncComplete);
    };
  }, []);

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

  const handleEditSubmit = async (updatedGame) => 
  {
    const online = navigator.onLine;
    const server = await isServerAvailable();
    if (!online || !server) 
    {
      enqueueOperation({
        type: updatedGame.id ? "UPDATE" : "CREATE",
        endpoint: "/api/games",
        method: updatedGame.id ? "PUT" : "POST",
        payload: updatedGame,
      });
      alert("Offline/server error. Changes will sync automatically later.");
      setShowEdit(false);
      return;
    }
    else
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
    }
  };

  const handleConfirmDelete = async () => 
  {
    const online = navigator.onLine;
    const server = await isServerAvailable();
    if (!online || !server) 
    {
      enqueueOperation({
        type: "DELETE",
        endpoint: `/api/games?id=${selectedGame.id}`,
        method: "DELETE",
        payload: { id: selectedGame.id },
      });
      alert("Delete action queued. Will sync when online.");
      setShowConfirmation(false);
      return;
    }
    else
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
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <MainWindow
        games={games}
        allGames={allGames}
        onNewEntry={handleNewEntry}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchTerm={searchTerm}
        sortOption={sortOption}
        onSearchChange={handleSearchChange}
        onSortChange={handleSortChange}
        hasMore={hasMore}
        isLoading={isLoading}
        onLoadMore={handleLoadMore}
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
