import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createProject,
  getProjects,
  getProjectById,
  getPreviewStatus,
  deleteProject,
  renameProject,
  toggleFavorite,
  duplicateProject,
} from "../actions";

export const useGetProjects = () => {
  return useQuery({
    queryKey: ["projects"],
    queryFn: () => getProjects(),
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (value) => createProject(value),
    onSuccess: () => {
      // ["projects", "status"] is a single two-segment key and matches nothing.
      // Both caches have to be invalidated separately.
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["status"] });
    },
  });
};

export const useGetProjectById = (projectId) => {
  return useQuery({
    queryKey: ["project", projectId],
    queryFn: () => getProjectById(projectId),
    enabled: !!projectId,
  });
};

export const usePreviewStatus = (sandboxUrl) => {
  return useQuery({
    queryKey: ["preview-status", sandboxUrl],
    queryFn: () => getPreviewStatus(sandboxUrl),
    enabled: !!sandboxUrl,
    // A live sandbox can expire while the tab is open, so re-check periodically,
    // but stop once we know it is gone since that is terminal.
    refetchInterval: (query) =>
      query.state.data === "expired" ? false : 30000,
    staleTime: 10000,
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (projectId) => deleteProject(projectId),
    onSuccess: (_data, projectId) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      // Drop the detail cache so navigating back does not show a ghost project.
      queryClient.removeQueries({ queryKey: ["project", projectId] });
      queryClient.removeQueries({ queryKey: ["messages", projectId] });
    },
  });
};

export const useRenameProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, name }) => renameProject(projectId, name),
    onSuccess: (_data, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
    },
  });
};

export const useToggleFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (projectId) => toggleFavorite(projectId),
    // Optimistic: starring should feel instant.
    onMutate: async (projectId) => {
      await queryClient.cancelQueries({ queryKey: ["projects"] });

      const previous = queryClient.getQueryData(["projects"]);

      queryClient.setQueryData(["projects"], (old) =>
        Array.isArray(old)
          ? old.map((p) =>
              p.id === projectId ? { ...p, isFavorite: !p.isFavorite } : p,
            )
          : old,
      );

      return { previous };
    },
    onError: (_error, _projectId, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["projects"], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};

export const useDuplicateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (projectId) => duplicateProject(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};
