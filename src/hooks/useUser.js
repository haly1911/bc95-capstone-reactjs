import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userApi } from "../api/userApi";

export const useProfile = (isLoggedIn, account) => {
  return useQuery({
    queryKey: ["profile", account],
    queryFn: async () => {
      const response = await userApi.getProfile();
      return response.data.content;
    },
    enabled: isLoggedIn && !!account,
    refetchOnMount: "always",
  });
};

export const useUsers = (groupId = "GP01", page = 1, pageSize = 20, keyword = "") => {
  return useQuery({
    queryKey: ["users", groupId, page, pageSize, keyword],
    queryFn: async () => {
      const response = await userApi.getUserList(groupId, page, pageSize, keyword);
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
    },
  });
};

export const useUpdateUserByAdmin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userData) => userApi.updateUserByAdmin(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (account) => userApi.deleteUser(account),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};
