/*
  import { ColumnConfig } from "@/lib/types/types";
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { Column, SortingState, Table as TablePrimitive, VisibilityState } from "@tanstack/react-table"
import { ColumnConfig } from "@/lib/types/types";

const useStickyHeader = (defaultSticky = false) => {
    const [isSticky, setIsSticky] = useState(defaultSticky);
    const tableRef = useRef<HTMLTableElement>(null);

    const toggleStickiness = useCallback(
        ({ top, bottom }: { top: number, bottom: number }) => {
            if (
                top <= 0 &&
                // When scrolling from bottom to top when and
                // the last row is visible enough, sticky header will be triggered.
                // This number (68) could be adjusted or skipped.
                bottom > 2 //* 68
            ) {
                !isSticky && setIsSticky(true);
            } else {
                isSticky && setIsSticky(false);
            }
        },
        [isSticky]
    );

    useEffect(() => {
        const handleScroll = () => {
            if (tableRef?.current)
                toggleStickiness(tableRef.current.getBoundingClientRect());
        };
        window.addEventListener("scroll", handleScroll);
        window.addEventListener("resize", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", handleScroll);
        };
    }, [toggleStickiness]);

    return { tableRef, isSticky };
};

export default useStickyHeader;

export interface ColumnMeta {
    title: string
}

export interface TableMeta {
    sortChanged?: () => void
    saveColumnConfig?: (saveForAll: boolean) => void
}

export function getColumnTitle<T>(column: Column<T, unknown>) {
    return (column.columnDef.meta as ColumnMeta)?.title ?? column.id;
}

export function getColumnMeta<T>(column: Column<T, unknown>) {
    return column.columnDef.meta as ColumnMeta;
}

export function getTableMeta<T>(table: TablePrimitive<T>) {
    return table.options.meta as TableMeta;
}

export function getColumnVisibilityState(columnConfig: ColumnConfig | null) {
    let visibilityState: VisibilityState = {}
    columnConfig?.hidden?.forEach((col) => {
        visibilityState[col.column] = false;
    })
    return visibilityState;
}

export function getColumnSortingState(columnConfig: ColumnConfig | null) {
    let sortingState: SortingState = [];
    columnConfig?.sort?.sort((a, b) => {
        const valueA = a.index;
        const valueB = b.index;
        if (valueA < valueB) {
            return -1;
        }
        if (valueA > valueB) {
            return 1;
        }
        return 0;
    })
    columnConfig?.sort?.forEach((col) => {
        sortingState.push({
            id: col.column,
            desc: col.descending,
        })
    })
    return sortingState;
}

export function setColumnSequence<T>(table: TablePrimitive<T>, columnConfig: ColumnConfig | null) {

    const allColumns = table.getAllColumns();
    const columnSequence = allColumns.map((col, index) => {
        return {
            col, index
        }
    })

    columnConfig?.sequence?.sort((a, b) => {
        const valueA = a.index;
        const valueB = b.index;
        if (valueA < valueB) {
            return -1;
        }
        if (valueA > valueB) {
            return 1;
        }
        return 0;
    });

    columnConfig?.sequence?.forEach((configSequence) => {
        let currentSequence = columnSequence?.find((a) => a.col.id == configSequence.column);
        if (!currentSequence) return;

        if (currentSequence.index === configSequence.index) return;

        let replaceSequence = columnSequence?.find((a) => a.index == configSequence.index);
        if (!replaceSequence) return;

        let currentIndex = columnSequence.findIndex((a) => a.col.id == currentSequence!.col!.id);
        columnSequence.splice(currentIndex, 1);

        let replaceIndex = columnSequence.findIndex((a) => a.col.id == replaceSequence!.col!.id);
        columnSequence.splice(replaceIndex, 0, currentSequence);

        columnSequence.forEach((col, index) => col.index = index);
    });


    table.getAllColumns().sort((a, b) => {
        const valueA = columnSequence.find((col) => col.col.id == a.id)!.index;
        const valueB = columnSequence.find((col) => col.col.id == b.id)!.index;

        if (valueA < valueB) {
            return -1;
        }
        if (valueA > valueB) {
            return 1;
        }
        return 0;
    })

    table.resetColumnOrder(true);

}
