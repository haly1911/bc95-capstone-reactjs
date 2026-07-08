import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userApi } from "../api/userApi";

export const useProfile = (isLoggedIn) => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const response = await userApi.getProfile();
      return response.data.content;
    },
    enabled: isLoggedIn,
  });
};

export const useUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await userApi.getUserList();
      return response.data.content;
    },
  });
};

export const useAddUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userData) => userApi.addUser(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userData) => userApi.updateUser(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};
