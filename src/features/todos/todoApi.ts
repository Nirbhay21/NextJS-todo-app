import { baseApi } from "@/store/api/baseApi";
import { TodoItem } from "@/types/todo";

const todoApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTodos: builder.query<TodoItem[], void>({
      query: () => "/todos",
      providesTags: ["Todo"],
    }),

    addTodo: builder.mutation<TodoItem, { text: string }>({
      query: (body) => ({
        url: "/todos",
        method: "POST",
        body,
      }),
      onQueryStarted: async ({ text }, { dispatch, queryFulfilled }) => {
        const tempId = crypto.randomUUID();
        const patchResult = dispatch(
          todoApi.util.updateQueryData("getTodos", undefined, (draft) => {
            draft.push({
              _id: tempId,
              text: text,
              completed: false,
            });
          })
        );

        try {
          const { data: newTodo } = await queryFulfilled;

          dispatch(
            todoApi.util.updateQueryData("getTodos", undefined, (draft) => {
              const index = draft.findIndex((todo) => todo._id === tempId);
              if (index !== -1) {
                draft[index] = newTodo;
              }
            })
          );
        } catch {
          patchResult.undo();
        }
      },
    }),

    updateTodo: builder.mutation<
      void,
      { id: string; text: string | undefined; completed: boolean | undefined }
    >({
      query: ({ id, text, completed }) => ({
        url: `/todos/${id}`,
        method: "PATCH",
        body: { text, completed },
      }),
      onQueryStarted: async (
        { id, text, completed },
        { dispatch, queryFulfilled }
      ) => {
        const patchResult = dispatch(
          todoApi.util.updateQueryData("getTodos", undefined, (draft) => {
            const todo = draft.find((todo) => todo._id === id);
            if (todo) {
              if (text !== undefined) {
                todo.text = text;
              }
              if (completed !== undefined) {
                todo.completed = completed;
              }
            }
          })
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),

    deleteTodo: builder.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `/todos/${id}`,
        method: "DELETE",
      }),
      onQueryStarted: async ({ id }, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          todoApi.util.updateQueryData("getTodos", undefined, (draft) => {
            const index = draft.findIndex((todo) => todo._id === id);
            if (index !== -1) {
              draft.splice(index, 1);
            }
          })
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
});

export const {
  useGetTodosQuery,
  useAddTodoMutation,
  useUpdateTodoMutation,
  useDeleteTodoMutation,
} = todoApi;
