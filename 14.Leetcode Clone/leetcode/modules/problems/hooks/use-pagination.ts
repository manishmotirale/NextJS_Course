"use client";

import { useState, useMemo } from "react";
import { ITEMS_PER_PAGE } from "../constant";

export function usePagination<T>(items: T[] = [], itemsPerPage = ITEMS_PER_PAGE) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(items.length / itemsPerPage);

  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return items.slice(startIndex, endIndex);
  }, [items, currentPage, itemsPerPage]);

  const displayRange = useMemo(() => {
    const total = items.length;
    // Handle edge case where there are no items
    if (total === 0) return { start: 0, end: 0, total: 0 };

    const start = (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(start + itemsPerPage - 1, total);
    return { start, end, total }; // 💡 Added total here to fix displayRange.total reference
  }, [currentPage, items.length, itemsPerPage]);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const resetPage = () => {
    setCurrentPage(1);
  };

  return {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedItems,
    displayRange,
    goToNextPage,
    goToPreviousPage,
    goToPage,
    resetPage,

    // Helpers for button states
    canGoNext: currentPage < totalPages,
    canGoPrevious: currentPage > 1, // 💡 Maps perfectly to table side call parameters
    canGoPreviousPage: currentPage > 1,
    showPagination: totalPages > 1,
  };
}
