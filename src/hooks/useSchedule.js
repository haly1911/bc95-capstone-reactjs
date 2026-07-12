import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { scheduleApi } from "../api/scheduleApi";

export const useScheduleByChain = (chainId = "", groupId = "GP01") => {
  return useQuery({
    queryKey: ["scheduleByChain", chainId, groupId],
    queryFn: async () => {
      const response = await scheduleApi.getScheduleByChain(chainId, groupId);
      return response.data.content;
    },
    enabled: chainId !== undefined && chainId !== null && chainId !== "",
  });
};

export const useScheduleByMovie = (movieId) => {
  return useQuery({
    queryKey: ["scheduleByMovie", movieId],
    queryFn: async () => {
      const response = await scheduleApi.getScheduleByMovie(movieId);
      return response.data.content;
    },
    enabled: movieId !== undefined && movieId !== null && movieId !== "",
  });
};

export const useCreateSchedule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => scheduleApi.createSchedule(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scheduleByMovie"] });
    },
  });
};
