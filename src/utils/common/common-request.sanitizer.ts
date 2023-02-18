export function getSanitizedPageAndLimit(rawRequest: any): { limit: number, page: number} {
  let { limit, page } = rawRequest;
  const sanitizedLimit = limit > 0 && limit < 50 ? limit : 50;
  const sanitizedPage = page > 0 ? page : 1;

  return {
    limit: sanitizedLimit,
    page: sanitizedPage,
  };
}