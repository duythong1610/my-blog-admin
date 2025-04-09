import { useQuery } from "@tanstack/react-query";
import { tagApi } from "api/tag.api";
import { debounce } from "lodash";
import { useCallback, useState } from "react";
import { QueryParam } from "types/query";
import { Tag } from "types/tag";

export type TagQuery = QueryParam;

interface TagProps {
  initQuery: TagQuery;
}

interface DataProps {
  tags: Tag[];
  total: number;
}

export const useTag = ({ initQuery }: TagProps) => {
  const [query, setQuery] = useState<TagQuery>(initQuery);

  const fetchTag = async (query: TagQuery) => {
    const response = await tagApi.findAll(query);
    return response.data;
  };

  const { data, isLoading, isError, refetch } = useQuery<DataProps>({
    queryKey: ["tags", query],
    queryFn: () => fetchTag(query),
    enabled: !!query,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  const debounceSearchTag = useCallback(
    debounce((searchValue: string) => {
      setQuery((prevQuery) => ({ ...prevQuery, search: searchValue }));
    }, 300),
    []
  );

  return {
    tags: data?.tags,
    totalTag: data?.total || 0,
    loadingTag: isLoading,
    fetchTag: refetch,
    queryTag: query,
    setQueryTag: setQuery,
    debounceSearchTag,
    isError,
  };
};
