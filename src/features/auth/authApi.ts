import { baseApi } from "@/store/api/baseApi";

interface AuthUser {
  id: string;
  fullname: string;
  email: string;
}

interface AuthSuccessResponse {
  message: string;
  user: AuthUser;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface SignupRequest {
  fullname: string;
  email: string;
  password: string;
}

const authApi = baseApi.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    signup: builder.mutation<AuthSuccessResponse, SignupRequest>({
      query: (body) => ({
        url: "/auth/signup",
        method: "POST",
        body,
      }),
    }),
    login: builder.mutation<AuthSuccessResponse, LoginRequest>({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User", "Todo"],
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["User", "Todo"],
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;
          dispatch(baseApi.util.resetApiState());
        } catch { }
      },
    }),
    getMe: builder.query<{ user: AuthUser }, void>({
      query: () => "/auth/me",
      providesTags: ["User"],
    }),
  }),
});

export const {
  useSignupMutation,
  useLoginMutation,
  useLogoutMutation,
  useGetMeQuery
} = authApi;
