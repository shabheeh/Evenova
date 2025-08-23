import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { loginUser } from "@/services/authService";
import type { LoginFormData, LoginUserApiResponse } from "@/types/auth.types";
import { clearUser, setUser } from "@/redux/features/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/redux/app/store";

const useAuth = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading } = useSelector(
    (state: RootState) => state.user
  );

  // const {
  //   data: user,
  //   isLoading: isCheckingAuth,
  //   // error,
  // } = useQuery({
  //   queryKey: ["auth", "me"],
  //   queryFn: async (): Promise<User> => {
  //     const response = await api.get("/auth/me");
  //     return response.data;
  //   },
  //   retry: false,
  //   staleTime: 1000 * 60 * 5,
  // });

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginFormData) => {
      return await loginUser(credentials);
    },
    onSuccess: (data: LoginUserApiResponse) => {
      queryClient.setQueryData(["auth", "me"], data.data.user);
      toast.success(data.message);
      dispatch(setUser(data.data.user));
      navigate(-1);
    },
    onError: (error: unknown) => {
      console.log(error instanceof Error  )
      toast.error(error instanceof Error ? error.message : "Login failed");
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await api.post("/auth/logout");
    },
    onSuccess: () => {
      queryClient.clear();
      clearUser();
      toast.success("Logged out successfully!");
      navigate("/login");
    },
    onError: (error: unknown) => {
      toast.error(error instanceof Error ? error.message : "Logout failed");
    },
  });

  return {
    user,
    isAuthenticated,
    isCheckingAuth: loading,
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
  };
};

export default useAuth;
