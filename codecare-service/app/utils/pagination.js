const parsePositiveInt = (value, fallback) => {
  const n = Number(value);
  if (!Number.isFinite(n) || n < 1) {
    return fallback;
  }
  return Math.floor(n);
};

export const getPageSize = () => {
  const raw = process.env.PAGE_SIZE ?? process.env.API_PAGE_SIZE ?? "10";
  return parsePositiveInt(raw, 10);
};

export const parsePage = (value) => parsePositiveInt(value, 1);

export const getPagination = (pageValue) => {
  const pageSize = getPageSize();
  const page = parsePage(pageValue);
  const skip = (page - 1) * pageSize;
  const limit = pageSize;
  return {page, pageSize, skip, limit};
};

export const calcTotalPages = (total, pageSize) =>
    Math.max(1, Math.ceil((Number(total) || 0) / pageSize));
