import { Grid, GridItem, Icon } from "@chakra-ui/react";
import { HiEye, HiEyeOff, HiUser } from "react-icons/hi";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { type Route, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import type { UserPublic } from "@/client";

import { ItemsService } from "@/client";
import { PaginationFooter } from "@/components/Common/PaginationFooter.tsx";

const PER_PAGE = 100;

function getItemsQueryOptions({ page }: { page: number }) {
  return {
    queryFn: () =>
      ItemsService.readItems({ skip: (page - 1) * PER_PAGE, limit: PER_PAGE }),
    queryKey: ["items", { page }],
  };
}

const ItemsGrid = ({
  route,
  currentUser,
}: {
  route: Route | any;
  currentUser?: UserPublic | null;
}) => {
  const queryClient = useQueryClient();
  const { page } = route.useSearch();
  const navigate = useNavigate({ from: route.fullPath });
  const setPage = (page: number) =>
    navigate({
      search: (prev: { [key: string]: string }) => ({ ...prev, page }),
    });

  const {
    data: items,
    isPending,
    isPlaceholderData,
  } = useQuery({
    ...getItemsQueryOptions({ page }),
    placeholderData: (prevData) => prevData,
  });

  const hasNextPage = !isPlaceholderData && items?.data.length === PER_PAGE;
  const hasPreviousPage = page > 1;

  useEffect(() => {
    if (hasNextPage) {
      queryClient.prefetchQuery(getItemsQueryOptions({ page: page + 1 }));
    }
  }, [page, queryClient, hasNextPage]);

  return (
    <>
      <div className="w-full px-6 py-6 ">
        {isPending ? (
          <Grid templateColumns="repeat(4, 1fr)" gap="6">
            {new Array(4).fill(null).map((_, index) => (
              <GridItem />
            ))}
          </Grid>
        ) : (
          <Grid templateColumns="repeat(4, 1fr)" gap="6">
            {items?.data.map((item) => (
              <GridItem className="relative">
                <img
                  src={item.full_result_url}
                  className="w-full sm:w-[32rem] h-auto m-auto rounded-md"
                />

                <div className="absolute top-0 left-0 w-full px-2 py-2 grid grid-cols-6 gap-4">
                  {currentUser && currentUser.id === item.owner_id && (
                    <Icon fontSize="2xl">
                      <HiUser />
                    </Icon>
                  )}
                  {item.is_public ? (
                    <Icon fontSize="2xl">
                      <HiEye />
                    </Icon>
                  ) : (
                    <Icon fontSize="2xl">
                      <HiEyeOff />
                    </Icon>
                  )}
                </div>
              </GridItem>
            ))}
          </Grid>
        )}
      </div>
      <PaginationFooter
        page={page}
        onChangePage={setPage}
        hasNextPage={hasNextPage}
        hasPreviousPage={hasPreviousPage}
      />
    </>
  );
};

export default ItemsGrid;
