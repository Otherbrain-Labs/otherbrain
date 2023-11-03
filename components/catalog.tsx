import { loadModels } from "@/app/page";
import { loadModels as loadAuthorModels } from "@/app/[authorSlug]/page";
import { DataTable } from "./catalog-table/data-table";
import { columns } from "./catalog-table/columns";

type Models =
  | Awaited<ReturnType<typeof loadModels>>
  | Awaited<ReturnType<typeof loadAuthorModels>>;

export default async function Catalog({ models }: { models: Models }) {
  if (models === null) {
    return null;
  }

  return (
    <div className="my-6 w-full overflow-hidden">
      <DataTable columns={columns} data={models} />
    </div>
  );
}
