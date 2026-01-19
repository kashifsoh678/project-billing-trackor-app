import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
  InfiniteData,
} from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import { TimeLog, BillingSummary, PaginatedResponse } from "@/types";
import { TimeLogInput } from "@/lib/validators";
import { toast } from "react-hot-toast";
import { AxiosError } from "axios";

export function useTimeLogs(
  params: {
    projectId?: string;
    userId?: string;
    page?: number;
    limit?: number;
  },
  currentUserId?: string,
) {
  return useQuery<PaginatedResponse<TimeLog>>({
    queryKey: ["time-logs", params, currentUserId],
    queryFn: async () => {
      const { data } = await apiClient.get<PaginatedResponse<TimeLog>>(
        "/time-logs",
        {
          params,
        },
      );
      return data;
    },
  });
}

export function useInfiniteTimeLogs(
  params: {
    projectId?: string;
    userId?: string;
    limit?: number;
  },
  currentUserId?: string,
) {
  return useInfiniteQuery<PaginatedResponse<TimeLog>>({
    queryKey: ["time-logs", "infinite", params, currentUserId],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await apiClient.get<PaginatedResponse<TimeLog>>(
        "/time-logs",
        {
          params: { ...params, page: pageParam },
        },
      );
      return data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (
        lastPage?.meta?.page &&
        lastPage?.meta?.totalPages &&
        lastPage.meta.page < lastPage.meta.totalPages
      ) {
        return lastPage.meta.page + 1;
      }
      return undefined;
    },
  });
}

export function useCreateTimeLog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (logData: TimeLogInput) => {
      const { data } = await apiClient.post("/time-logs", logData);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["time-logs"] });
      queryClient.invalidateQueries({
        queryKey: ["billing-summary", variables.projectId],
      });
      toast.success("Time log created successfully");
    },
    onError: (error: AxiosError<{ error: string }>) => {
      const message =
        error.response?.data?.error || "Failed to create time log";
      toast.error(message);
    },
  });
}

export function useUpdateTimeLog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data: logData,
    }: {
      id: string;
      data: Partial<TimeLogInput>;
    }) => {
      const { data } = await apiClient.patch<TimeLog>(
        `/time-logs/${id}`,
        logData,
      );
      return data;
    },
    onMutate: async (newLog) => {
      await queryClient.cancelQueries({ queryKey: ["time-logs"] });

      const previousLogsQueries = queryClient.getQueriesData<
        PaginatedResponse<TimeLog> | InfiniteData<PaginatedResponse<TimeLog>>
      >({
        queryKey: ["time-logs"],
      });

      queryClient.setQueriesData<
        PaginatedResponse<TimeLog> | InfiniteData<PaginatedResponse<TimeLog>>
      >({ queryKey: ["time-logs"] }, (old) => {
        if (!old) return old;

        // Handle InfiniteData
        if ("pages" in old) {
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              data: page.data.map((log) =>
                log.id === newLog.id
                  ? ({ ...log, ...newLog.data } as TimeLog)
                  : log,
              ),
            })),
          };
        }

        // Handle PaginatedResponse
        return {
          ...old,
          data: old.data.map((log) =>
            log.id === newLog.id
              ? ({ ...log, ...newLog.data } as TimeLog)
              : log,
          ),
        };
      });

      return { previousLogsQueries };
    },
    onSuccess: () => {
      toast.success("Time log updated");
    },
    onError: (error: AxiosError<{ error: string }>, _newLog, context) => {
      if (context?.previousLogsQueries) {
        context.previousLogsQueries.forEach(([queryKey, oldData]) => {
          queryClient.setQueryData(queryKey, oldData);
        });
      }
      const message =
        error.response?.data?.error || "Failed to update time log";
      toast.error(message);
    },
    onSettled: (data) => {
      queryClient.invalidateQueries({ queryKey: ["time-logs"] });
      if (data) {
        queryClient.invalidateQueries({
          queryKey: ["billing-summary", data.projectId],
        });
      }
    },
  });
}

export function useDeleteTimeLog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/time-logs/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["time-logs"] });
      queryClient.invalidateQueries({ queryKey: ["billing-summary"] });
      toast.success("Time log deleted");
    },
    onError: () => {
      toast.error("Failed to delete time log");
    },
  });
}

export function useBillingSummary(projectId: string) {
  return useQuery<BillingSummary>({
    queryKey: ["billing-summary", projectId],
    queryFn: async () => {
      const { data } = await apiClient.get(
        `/projects/${projectId}/billing-summary`,
      );
      return data;
    },
    enabled: !!projectId,
  });
}
