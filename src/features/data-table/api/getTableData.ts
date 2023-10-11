import { ReturnedQueryData } from "../types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchData } from "../../../mockUserDataEndpoint";

export const getUserData = (start: number): ReturnedQueryData => {
  // This would normally be where we would use Axios to fetch the data from the API
  return fetchData(start);
};

const useUserData = () =>
  useInfiniteQuery({
    queryKey: ["userDate"],
    queryFn: ({ pageParam = 1 }) => getUserData(pageParam),
    getNextPageParam: (_lastGroup, groups) => groups.length,
    keepPreviousData: true,
    refetchOnWindowFocus: false,
  });

export default useUserData;
