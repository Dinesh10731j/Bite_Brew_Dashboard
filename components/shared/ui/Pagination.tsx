"use client";

type PaginationProps = {
  page?: number;
  totalPages?: number;
};

export function Pagination({ page = 1, totalPages = 8 }: PaginationProps) {
  return (
    <div className="flex items-center justify-between gap-3 pt-4 text-sm text-slate-500 dark:text-slate-300">
      <span>
        Page {page} of {totalPages}
      </span>
      <div className="flex gap-2">
        <button className="rounded-xl border border-brand/15 px-3 py-2">Previous</button>
        <button className="rounded-xl bg-brand px-3 py-2 text-white">Next</button>
      </div>
    </div>
  );
}
