import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import { TimeLog, BillingSummary, PaginatedResponse } from "@/types";
import { TimeLogInput } from "@/lib/validators";
import { toast } from "react-hot-toast";
import { AxiosError } from "axios";

export function useTimeLogs(params: {
  projectId?: string;
  userId?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery<PaginatedResponse<TimeLog>>({
    queryKey: ["time-logs", params],
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
      const { data } = await apiClient.patch(`/time-logs/${id}`, logData);
      return data;
    },
    onSuccess: (data: TimeLog) => {
      queryClient.invalidateQueries({ queryKey: ["time-logs"] });
      queryClient.invalidateQueries({
        queryKey: ["billing-summary", data.projectId],
      });
      toast.success("Time log updated");
    },
    onError: (error: AxiosError<{ error: string }>) => {
      const message =
        error.response?.data?.error || "Failed to update time log";
      toast.error(message);
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
