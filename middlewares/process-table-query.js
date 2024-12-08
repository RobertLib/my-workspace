export default function processTableQuery(
  sortColumns,
  defaultSortKey = "id",
  defaultSortOrder = "desc",
  defaultLimit = 20,
  defaultOffset = 0
) {
  return (req, res, next) => {
    const sortKey = req.query.sortKey || defaultSortKey;
    const sortOrder = req.query.sortOrder || defaultSortOrder;
    const limit = req.query.limit || defaultLimit;
    const offset = req.query.offset || defaultOffset;

    if (!sortColumns.includes(sortKey)) {
      return res.status(400).send("Invalid sort column.");
    }

    const parsedLimit = parseInt(String(limit), 10);
    const parsedOffset = parseInt(String(offset), 10);

    if (
      isNaN(parsedLimit) ||
      parsedLimit <= 0 ||
      isNaN(parsedOffset) ||
      parsedOffset < 0
    ) {
      return res.status(400).send("Invalid query parameters.");
    }

    req.processedQuery = {
      ...req.query,
      sortKey,
      sortOrder: sortOrder === "asc" ? "asc" : "desc",
      limit: String(parsedLimit),
      offset: String(parsedOffset),
    };

    next();
  };
}
