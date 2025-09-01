import { useQuery } from "@tanstack/react-query";
import type { Entry } from "@/lib/types";

const API_URL = import.meta.env.VITE_API_URL;

type FetchEntriesParams = {
  excluded?: string;
  limit?: number;
};

const fetchEntries = async ({
  excluded,
  limit = 1
}: FetchEntriesParams = {}): Promise<Entry[]> => {
  const url = new URL(API_URL);
  if (limit > 1) {
    url.searchParams.set("limit", limit.toString());
  }
  if (excluded) {
    url.searchParams.set("excluded", excluded);
  }
  const response = await fetch(url.toString());
  if (!response.ok) {
    const { error } = await response.json();
    throw new Error(error);
  }

  return response.json();
};

const useEntriesQuery = ({
  params,
  enabled
}: { params?: FetchEntriesParams; enabled?: boolean } = {}) =>
  useQuery({
    queryKey: ["entries", params],
    queryFn: () => fetchEntries(params),
    enabled
  });

export default useEntriesQuery;
