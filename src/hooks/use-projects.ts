import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import { Project, PaginatedResponse } from "@/types";
import { ProjectInput } from "@/lib/validators";
import { toast } from "react-hot-toast";
import { AxiosError } from "axios";

export const useProjects = (params: {
  page: number;
  limit: number;
  status?: string;
  search?: string;
}) => {
  return useQuery<PaginatedResponse<Project>>({
    queryKey: ["projects", params],
    queryFn: async () => {
      const { data } = await apiClient.get<PaginatedResponse<Project>>(
        "/projects",
        {
          params,
        },
      );
      return data;
    },
  });
};

export const useProject = (id: string) => {
  return useQuery<Project>({
    queryKey: ["projects", id],
    queryFn: async () => {
      const { data } = await apiClient.get<Project>(`/projects/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: ProjectInput) => {
      const { data } = await apiClient.post<Project>("/projects", input);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project created successfully");
    },
    onError: (error: AxiosError<{ error: string }>) => {
      toast.error(error.response?.data?.error || "Failed to create project");
    },
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      input,
    }: {
      id: string;
      input: Partial<ProjectInput>;
    }) => {
      const { data } = await apiClient.patch<Project>(`/projects/${id}`, input);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["projects", data.id] });
      toast.success("Project updated successfully");
    },
    onError: (error: AxiosError<{ error: string }>) => {
      toast.error(error.response?.data?.error || "Failed to update project");
    },
  });
};

export const useArchiveProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await apiClient.delete<Project>(`/projects/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project archived successfully");
    },
    onError: (error: AxiosError<{ error: string }>) => {
      toast.error(error.response?.data?.error || "Failed to archive project");
    },
  });
};
