module.exports = (objectPagination, query, countRecord) => {
  if (query.pagination) {
    objectPagination.currentPagination = query.pagination;
  }

  if (query.limit) {
    objectPagination.limitRecord = query.limit;
  }
  objectPagination.skip = Math.ceil((objectPagination.currentPagination - 1) * objectPagination.limitRecord);
  objectPagination.totalPage = Math.ceil(countRecord / objectPagination.limitRecord);

  return objectPagination;
}