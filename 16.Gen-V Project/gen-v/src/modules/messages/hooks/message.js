import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { createMessage, getMessage } from "@/modules/messages/actions/index";

export const prefetchMessages = async (queryClient, projectId) => {
  await queryClient.prefetchQuery({
    queryKey: ["messages", projectId],
    queryFn: () => getMessage(projectId),
    staleTime: 10000,
  });
};

export const useGetMessages = (projectId) => {
  return useQuery({
    queryKey: ["messages", projectId],
    queryFn: () => getMessage(projectId),
    enabled: !!projectId,
    staleTime: 10000,
    // In React Query v5 refetchInterval receives the query, not the data.
    // Keep polling while the newest message is still a USER message, which
    // means the agent has not replied yet.
    refetchInterval: (query) => {
      const messages = query?.state?.data;

      if (!messages?.length) return false;

      return messages[messages.length - 1]?.role === "USER" ? 5000 : false;
    },
  });
};

export const useCreateMessages = (projectId) => {
  // `queryClient` was used without ever being created, which threw a
  // ReferenceError inside onSuccess after every message was sent.
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (value) => createMessage(value, projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages", projectId] });
      queryClient.invalidateQueries({ queryKey: ["status"] });
    },
  });
};
