import { useQuery } from "@tanstack/react-query";
import { cinemaApi } from "../api/cinemaApi";

export const useCinemaChains = () => {
  return useQuery({
    queryKey: ["cinemaChains"],
    queryFn: async () => {
      const response = await cinemaApi.getCinemaChains();
      return response.data.content;
    },
  });
};

export const useCinemaComplexesByChain = (chainId) => {
  return useQuery({
    queryKey: ["cinemaComplexes", chainId],
    queryFn: async () => {
      const response = await cinemaApi.getCinemaComplexesByChain(chainId);
      return response.data.content;
    },
    enabled: chainId !== undefined && chainId !== null && chainId !== "",
  });
};
