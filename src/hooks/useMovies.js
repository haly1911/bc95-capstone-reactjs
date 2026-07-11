import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { movieApi } from "../api/movieApi";

export const useMovieList = (groupId = "GP01", page = 1, pageSize = 8, movieName = "") => {
  const cleanQuery = movieName.trim();

  return useQuery({
    queryKey: ["movieList", groupId, page, pageSize, cleanQuery],
    queryFn: async () => {
      const response = await movieApi.getMovieList(groupId, page, pageSize, cleanQuery);
      return response.data.content;
    },
    placeholderData: (keepPreviousData) => keepPreviousData,
  });
};

export const useMovieDetail = (movieId) => {
  return useQuery({
    queryKey: ["movieDetail", movieId],
    queryFn: async () => {
      const response = await movieApi.getMovieDetail(movieId);
      return response.data.content;
    },
    enabled: !!movieId,
  });
};

export const useAddMovie = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData) => movieApi.addMovie(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["movieList"] });
    },
  });
};

export const useUpdateMovie = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData) => movieApi.updateMovie(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["movieList"] });
    },
  });
};

export const useDeleteMovie = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (movieId) => movieApi.deleteMovie(movieId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["movieList"] });
    },
  });
};
