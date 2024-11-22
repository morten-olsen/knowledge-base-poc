import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useStoreContext } from "./store.context";
import { nanoid } from "nanoid";

const useDocuments = () => {
  const { store } = useStoreContext();
  return useQuery({
    queryKey: ['documents'],
    queryFn: async () => {
      const results = await store.request('getDocuments', {});
      return results;
    }
  });
}

const useUpdate = () => {
  const { store } = useStoreContext();
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: ['update'],
    queryFn: async () => {
      await store.request('update', {});
      return true;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['documents'],
      });
      queryClient.invalidateQueries({
        queryKey: ['search'],
      });
    },
  })
}

const useAddDocument = () => {
  const { store } = useStoreContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: string) => {
      await store.request('add', {
        items: [{
          id: nanoid(),
          body,
        }]
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['documents'],
      });
      queryClient.invalidateQueries({
        queryKey: ['search'],
      });
    },
  });
}

const useSearch = () => {
  const { store } = useStoreContext();
  return useMutation({
    mutationKey: ['search'],
    mutationFn: async (prompt: string) => {
      const result = await store.request('search', {
        prompt,
      });
      return result;
    }
  });
}

export { useDocuments, useAddDocument, useSearch, useUpdate };
