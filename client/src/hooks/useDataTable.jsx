import { useSearchParams } from "react-router";

export default function useDataTable() {
  const [searchParams] = useSearchParams();

  const filters = JSON.parse(searchParams.get("filters") ?? "{}");
  const sortKey = searchParams.get("sortKey") ?? "";
  const sortOrder = searchParams.get("sortOrder") ?? "asc";
  const page = parseInt(searchParams.get("page") ?? "1", 10);
  const limit = parseInt(searchParams.get("limit") ?? "20", 10);

  return {
    ...filters,
    sortKey,
    sortOrder,
    limit: limit.toString(),
    offset: String((page - 1) * limit),
  };
}
