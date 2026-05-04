"use client";

type PaginationProps = {
  page?: number;
  totalPages?: number;
  onPreviousPage?: () => void;
  onNextPage?: () => void;
};

export function Pagination({ page = 1, totalPages = 1, onPreviousPage, onNextPage }: PaginationProps) {
  const hasPrevious = page > 1;
  const hasNext = page < totalPages;

  return (
    <div className="flex items-center justify-between gap-3 pt-4 text-sm text-slate-500 dark:text-slate-300">
      <span>
        Page {page} of {totalPages}
      </span>
      <div className="flex gap-2">
        <button
          className="rounded-xl border border-brand/15 px-3 py-2 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!hasPrevious || !onPreviousPage}
          onClick={onPreviousPage}
        >
          Previous
        </button>
        <button
          className="rounded-xl bg-brand px-3 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!hasNext || !onNextPage}
          onClick={onNextPage}
        >
          Next
        </button>
      </div>
    </div>
  );
}
