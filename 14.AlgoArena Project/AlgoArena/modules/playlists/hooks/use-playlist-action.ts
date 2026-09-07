"use client";

import { useState } from "react";
import { toast } from "sonner";

export function usePlaylistActions() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAddToPlalistModalOpen, setIsAddToPlalistModalOpen] = useState(false);
  const [selectedProblemId, setSelectedProblemId] = useState(null);

  const handleCreatePlaylist = async (data: any) => {
    try {
      const response = await fetch("/api/playlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          description: data.description,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setIsCreateModalOpen(false);
        toast.success("Playlist Created Successfully!");
        return true;
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      console.error("Error Creating Playlist: ", error);
      toast.error(error?.message || "Failed to create playlist");
      return false;
    }
  };

  const handleAddToPlaylist = async (problemId:string, playlistId:string) => {
    try {
      const response = await fetch("/api/playlist/add-problem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problemId, playlistId
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Keep the modal open so the user can add to multiple playlists and
        // see the "Added" state update inline.
        toast.success("Problem added to playlist!");
        return true;
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      console.error("Error Creating Playlist: ", error);
      toast.error(error?.message || "Failed to add Problem to playlist");
      return false;
    }
  };
  
  
  const openAddToPlaylist = (problemId:any )=>{
      setSelectedProblemId(problemId);
      setIsAddToPlalistModalOpen(true);
    }

    return {
        isCreateModalOpen,
        openCreateModal : () => setIsCreateModalOpen(true) ,

        closeCreateModal: ()=> setIsCreateModalOpen(false),
        handleCreatePlaylist,

        //Add to Playlist modal
        isAddToPlalistModalOpen,
        selectedProblemId,
        openAddToPlaylist,
        closeAddToPlaylistModal: ()=> setIsAddToPlalistModalOpen(false),
        handleAddToPlaylist,

    }
}
