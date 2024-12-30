import { Container } from "@chakra-ui/react";
import { createFileRoute } from "@tanstack/react-router";
import FormGenerate from "@/components/Common/FormGenerate/FormGenerate";
import ItemsGrid from "@/components/Items/ItemsGrid/ItemsGrid";
import { z } from "zod";

import useAuth from "@/hooks/useAuth";

const itemsSearchSchema = z.object({
  page: z.number().catch(1),
});

export const Route = createFileRoute("/_layout/")({
  component: Dashboard,
  validateSearch: (search) => itemsSearchSchema.parse(search),
});

function Dashboard() {
  const { user: currentUser } = useAuth();

  return (
    <>
      <div className="w-full items-center justify-items-center min-h-screen  gap-16  font-[family-name:var(--font-geist-sans)]">
        <FormGenerate />

        <ItemsGrid route={Route} currentUser={currentUser} />
        {/* <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center"></footer> */}
      </div>
    </>
  );
}
