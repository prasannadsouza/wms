"use client"
import * as React from "react"
import { ChevronDown } from "lucide-react";
import { Column, ColumnSort, flexRender, Table as TablePrimitive } from "@tanstack/react-table"
import { ArrowDownIcon, ArrowUpIcon, CaretDownIcon, CaretSortIcon, CaretUpIcon, CheckboxIcon, Cross2Icon, DotsHorizontalIcon } from "@radix-ui/react-icons"

/*
import { DropdownMenu, DropdownMenuContent, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table"
import { DataTablePagination } from "@/components/customui/datatable/pagination"
import useStickyHeader, { getColumnTitle, getTableMeta, DataTableConstants, initializeTableState, getTableConfig } from "@/components/customui/datatable/extensions"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { FormInput, FormInputHandle } from "@/components/customui/forminput"
import { ConfirmDialog } from '@/lib/types/models'
import { CommonDialogProps } from '@/lib/types/props';
*/
import { DropdownMenu, DropdownMenuContent, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table"
import { DataTablePagination } from "@/components/customui/datatable/pagination"
import useStickyHeader, { getColumnTitle, getTableMeta, DataTableConstants, initializeTableState, getTableConfig } from "@/components/customui/datatable/extensions"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { FormInput, FormInputHandle } from "@/components/customui/forminput"
import { ConfirmDialog } from '@/lib/types/models'
import { CommonDialogProps } from '@/lib/types/props';

export interface Props<T> {
    table: TablePrimitive<T>,
    commonDialogProps: CommonDialogProps,
}

export function DataTable<T>({
    props,

}: { props: Props<T>, }) {

    const { table, commonDialogProps } = props
    const { tableRef, isSticky } = useStickyHeader();
    const refFilterColumns = React.useRef<FormInputHandle>(null);
    const tableMeta = getTableMeta(table)

    const allColsForSort = getColumnsForSort(table);

    const renderHeader = () => {
        return (
            <TableHeader className="h-8 bg-slate-50 text-dark" style={isSticky ? {
                position: "sticky",
                top: 0,
            } : undefined}>
                {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id} className="h-8 p-0 px-1" >
                        {headerGroup.headers.map((header) => {
                            return (
                                <TableHead key={header.id} className="h-8  px-1 py-1 bg-slate-50 text-dark">
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                </TableHead>
                            )
                        })}
                    </TableRow>
                ))}
            </TableHeader>)
    };


    function getColumnMenu() {

        function GetConfigMenu({ title, onSaveClick, onLoadClick, onDeleteClick }: {
            title: string
            , onSaveClick: () => void
            , onLoadClick: () => void
            , onDeleteClick: () => void
        }) {
            return (<DropdownMenuSub >
                <DropdownMenuSubTrigger>
                    {title}
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                    <div className="space-y-1">
                        <div className="flex">
                            <Button onClick={() => { onSaveClick() }} variant="outline" className={cn("flex  h-8 px-5 py-0.5 rounded grow hover:border-2")} >Save</Button>
                        </div>
                        <div className="flex">
                            <Button onClick={() => { onLoadClick() }} variant="outline" className={cn("flex  h-8 px-5 py-0.5 rounded grow hover:border-2")} >Load</Button>
                        </div>
                        <div className="flex">
                            <Button onClick={() => {
                                const model: ConfirmDialog = {
                                    title: "Confirm Delete Config",
                                    message: "Are you sure you want to delete table conifg",
                                    confirmTitle: "Yes",
                                    cancelTitle: "No",
                                }

                                const useConfirm = commonDialogProps?.useConfirm
                                useConfirm && useConfirm.showConfirm({ model, onClose: onDeleteConfirmed })

                                function onDeleteConfirmed(confirmed: Boolean) {
                                    if (confirmed) onDeleteClick()
                                }


                            }} variant="outline" className={cn("flex  h-8 px-5 py-0.5 rounded grow hover:border-2")} >Delete</Button>
                        </div>
                    </div>
                </DropdownMenuSubContent>
            </DropdownMenuSub>)
        }

        function getTableConfigOptions() {
            return (<DropdownMenuSub>
                <DropdownMenuSubTrigger className="hover:border-2">
                    Config
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                    <div>
                        <GetConfigMenu title="For Me"
                            onLoadClick={() => { tableMeta?.loadSavedTableConfig && tableMeta.loadSavedTableConfig(table, false, false) }}
                            onSaveClick={() => { tableMeta?.saveTableConfig && tableMeta.saveTableConfig(table, false, false) }}
                            onDeleteClick={() => { tableMeta?.deleteSavedTableConfig && tableMeta.deleteSavedTableConfig(table, false, false) }} />
                        {tableMeta.showConfigOptionsForAll && <GetConfigMenu title="For All"
                            onLoadClick={() => { tableMeta?.loadSavedTableConfig && tableMeta.loadSavedTableConfig(table, true, false) }}
                            onSaveClick={() => { tableMeta?.saveTableConfig && tableMeta.saveTableConfig(table, true, false) }}
                            onDeleteClick={() => { tableMeta?.deleteSavedTableConfig && tableMeta.deleteSavedTableConfig(table, true, false) }} />}
                        {tableMeta.showConfigOptionsForDefault && <GetConfigMenu title="For Default"
                            onLoadClick={() => { tableMeta?.loadSavedTableConfig && tableMeta.loadSavedTableConfig(table, false, true) }}
                            onSaveClick={() => { tableMeta?.saveTableConfig && tableMeta.saveTableConfig(table, false, true) }}
                            onDeleteClick={() => { tableMeta?.deleteSavedTableConfig && tableMeta.deleteSavedTableConfig(table, false, true) }} />}
                    </div>
                </DropdownMenuSubContent>
            </DropdownMenuSub>)
        }

        function getTableColumnViewOptions() {
            return (<DropdownMenuSub>
                <DropdownMenuSubTrigger className="hover:border-2">
                    Show
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                    {getColumnsByName(table.getAllFlatColumns().filter((column) => column.getCanHide())).map((column) => {
                        return <CheckBoxForShowColumn key={column.id} column={column} />
                    })}
                </DropdownMenuSubContent>
            </DropdownMenuSub>)
        }
        function getTableSortOptions() {
            return (
                <DropdownMenuSub>
                    <DropdownMenuSubTrigger className="hover:border-2">
                        Sort
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                        {
                            allColsForSort.map((column) => {
                                return <SortOptionsForColumn key={column.id} table={table} allColumns={allColsForSort} column={column} />
                            })}

                    </DropdownMenuSubContent>
                </DropdownMenuSub>)
        }

        function getTableColumnSequenceOptions() {
            return (<DropdownMenuSub>
                <DropdownMenuSubTrigger className="hover:border-2">
                    Sequence
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                    {table.getAllColumns().filter((column) =>
                        column.getIsVisible).map((column) => {
                            return <SequenceOptionsForColumn key={column.id} table={table} column={column} />
                        })}
                </DropdownMenuSubContent>
            </DropdownMenuSub>)
        }

        function getTableColumnResetOption() {
            return (<div className="flex items-center justify-center space-x-1">
                <Button onClick={() => {
                    if (!tableMeta?.tableConfig) return;
                    initializeTableState(table, tableMeta!.tableConfig)
                }} variant="outline" className={cn("h-8 px-5 py-0.5 rounded hover:border-2")}>Reset</Button>
            </div>)
        }

        return (<DropdownMenu>
            <DropdownMenuTrigger className="flex flex-content rounded text-sm px-1 py-1 h-8 w-auto cursor-pointer hover:border-2 underline">
                Columns
                <ChevronDown className="m-0" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {getTableColumnViewOptions()}
                {getTableSortOptions()}
                {getTableColumnSequenceOptions()}
                <DropdownMenuSeparator />
                {getTableConfigOptions()}
                <DropdownMenuSeparator />
                {getTableColumnResetOption()}
            </DropdownMenuContent>
        </DropdownMenu>)
    }

    function getTable() {
        return (<Table className="border w-full" ref={tableRef}>
            {renderHeader()}
            <TableBody className="z-0">
                {table.getRowModel().rows.map((row) => (
                    <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                    >
                        {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id} className="p-0 px-0.5 py-0.5">
                                {flexRender(
                                    cell.column.columnDef.cell,
                                    cell.getContext()
                                )}
                            </TableCell>
                        ))}
                    </TableRow>
                ))
                }
            </TableBody>
        </Table>)
    }

    function getSwitchTableButton() {
        if (tableMeta.isTableForSelectedData) {
            return (<Button
                variant="link"
                className="px-0.5 py-0.5 h-8 rounded hover:border-2"
                onClick={() => {
                    tableMeta.showMainTable && tableMeta.showMainTable()
                }}
            >
                View All
            </Button>)
        }

        return (<Button
            variant="link"
            className="px-0.5 py-0.5 h-8 rounded hover:border-2"
            onClick={() => {
                tableMeta.showSelectedTable && tableMeta.showSelectedTable()
            }}
        >
            View Selected
        </Button>)
    }

    return (
        <div className="space-y-1">
            <div className="border ">
                <div className="flex flex-wrap justify-between p-0.5">
                    <div>
                        {getSwitchTableButton()}
                    </div>
                    <div className="flex flex-wrap justify-between sm:justify-end">
                        <div className="align-middle ms-1" >
                            <FormInput ref={refFilterColumns} inputType={"text"} showLeftTitle={true} title="InSearch" minWidth={"100px"} onTextChange={(value: string) => {
                                table.options.onGlobalFilterChange && table.options.onGlobalFilterChange(value)

                            }}
                                onValueCleared={() => {
                                    table.options.onGlobalFilterChange && table.options.onGlobalFilterChange("")
                                }}
                            />
                        </div>
                        <div className="ml-1 flex grow justify-between">
                            <div className="grow"></div>
                            {getColumnMenu()}
                        </div>
                    </div>
                </div>
                {getTable()}
            </div>
            <DataTablePagination table={table} />
        </div>
    )
}

function CheckBoxForShowColumn<T>({ column }: { column: Column<T, unknown> }) {
    const id = "cb" + React.useId();
    return (<div className="flex items-center p-1 rounded hover:border-2"  >
        <Checkbox id={id}
            onCheckedChange={(value: any) =>
                column.toggleVisibility(!!value)
            }
            className="h-6 w-6" checked={column.getIsVisible()}>
        </Checkbox>
        <label className="ps-1 grow" htmlFor={id} ><span>{getColumnTitleElement(column)}</span></label>

    </div>)
}

function SortOptionsForColumn<T>({ table, allColumns, column }: { table: TablePrimitive<T>, allColumns: Column<T, unknown>[], column: Column<T, unknown> }) {
    const sortDirection = column.getIsSorted();
    const isSorted = !!column.getIsSorted();
    const sortChanged = getTableMeta(table)?.sortChanged;

    const isFirst = allColumns.at(0)?.id == column.id;
    const isLast = allColumns.at(-1)?.id == column.id;


    const isFirstSortedColumn = table.getState().sorting.at(0)?.id === column.id;
    const isLastSortedColumn = table.getState().sorting.at(-1)?.id === column.id;

    function moveColumnUp() {
        if (isFirstSortedColumn) return;
        if (!isSorted) return;

        let sortingState = table.getState().sorting;
        let sortIndex = sortingState.findIndex((state: ColumnSort) => state.id === column.id)
        const state = sortingState[sortIndex];
        sortingState.splice(sortIndex, 1)
        sortingState.splice(sortIndex - 1, 0, state)

        table.setSorting(sortingState);
        column.toggleSorting(state.desc, table.options.enableMultiSort === true)
        sortChanged && sortChanged()

    }
    function moveColumnDown() {
        if (isLastSortedColumn) return;
        if (!isSorted) return;

        let sortingState = table.getState().sorting;
        let sortIndex = sortingState.findIndex((state: ColumnSort) => state.id === column.id)
        const state = sortingState[sortIndex];
        sortingState.splice(sortIndex, 1)
        sortingState.splice(sortIndex + 1, 0, state)

        table.setSorting(sortingState);
        column.toggleSorting(state.desc, table.options.enableMultiSort === true)
        sortChanged && sortChanged()
    }

    function showUp() {
        if (isFirst) return false;
        if (!isSorted) return false;
        return true;
    }

    function showDown() {
        if (isLast) return false;
        if (!isSorted) return false;
        if (isLastSortedColumn) return false;
        return true;
    }

    return (<div className="flex items-center justify-between" >
        <div className="grow">
            <Button
                variant="ghost"
                className="px-0.5 py-0.5 w-full justify-start rounded hover:border-2"
                onClick={() => {
                    if (sortDirection === DataTableConstants.asc) {
                        column.toggleSorting(true, table.options.enableMultiSort === true)
                    }
                    else if (sortDirection === DataTableConstants.desc) {
                        column.toggleSorting(false, table.options.enableMultiSort === true)
                    }
                    else {
                        column.toggleSorting(false, table.options.enableMultiSort === true)
                    }
                    sortChanged && sortChanged()
                }}
            >
                {sortDirection === DataTableConstants.asc ? (
                    <ArrowUpIcon className="h-5 w-5" />
                ) : sortDirection === DataTableConstants.desc ? (
                    <ArrowDownIcon className="h-5 w-5" />
                ) : (
                    <CaretSortIcon className="h-5 w-5" />
                )}
                {getColumnTitleElement(column)}
            </Button>

        </div>
        <div className="flex justify-between">
            {!isSorted ? <div className="h-10 w-10"></div> : <Button className={cn("px-0.5 py-0.5 h-10 w-10 rounded hover:border-2")} variant="ghost" onClick={() => {
                column.clearSorting()
                sortChanged && sortChanged()
            }}  ><Cross2Icon className="h-5 w-5" /></Button>}
            {!showUp() ? <div className="h-10 w-10"></div> : <Button className={cn("px-0.5 py-0.5 h-10 w-10 rounded hover:border-2")} variant="ghost" onClick={() => moveColumnUp()}  ><CaretUpIcon className="h-5 w-5" /></Button>}
            {!showDown() ? <div className="h-10 w-10"></div> : <Button className={cn("px-0.5 py-0.5 h-10 w-10 rounded hover:border-2")} variant="ghost" onClick={() => moveColumnDown()}  ><CaretDownIcon className="h-5 w-5" /></Button>}
        </div>
    </div>)
}

function SequenceOptionsForColumn<T>({ table, column }: { table: TablePrimitive<T>, column: Column<T, unknown> }) {

    let currentIndex = 0;
    const allColumns = table.getAllColumns();
    const columnSequence = allColumns.map((col, index) => {
        if (col.id === column.id) currentIndex = index;
        return {
            col, index
        }
    })

    const isFirst = allColumns.at(0)!.id == column.id;
    const isLast = allColumns.at(-1)!.id == column.id;

    function moveColumnUp() {
        if (isFirst) return;
        columnSequence[currentIndex].index = currentIndex - 1;
        columnSequence[currentIndex - 1].index = currentIndex;
        sortColumns();
    }

    function moveColumnDown() {
        if (isLast) return;
        columnSequence[currentIndex].index = currentIndex + 1;
        columnSequence[currentIndex + 1].index = currentIndex;
        sortColumns();
    }

    function sortColumns() {
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

    return (<div className="flex items-center justify-between hover:underline" >
        {getColumnTitleElement(column)}
        <div className="flex justify-between">
            {isFirst ? <div className="h-10 w-10"></div> : <Button className={cn("px-0.5 py-0.5 h-10 w-10 rounded hover:border-2")} variant="ghost" onClick={() => moveColumnUp()}  ><CaretUpIcon className="h-5 w-5" /></Button>}
            {isLast ? <div className="h-10 w-10"></div> : <Button className={cn("px-0.5 py-0.5 h-10 w-10 rounded hover:border-2")} variant="ghost" onClick={() => moveColumnDown()}  ><CaretDownIcon className="h-5 w-5" /></Button>}
        </div>
    </div>)
}

function getColumnsByName<T>(cols: Column<T, unknown>[]) {
    return cols.sort((a, b) => {
        const valueA = getColumnTitle(a).toUpperCase();
        const valueB = getColumnTitle(b).toUpperCase();
        if (valueA < valueB) {
            return -1;
        }
        if (valueA > valueB) {
            return 1;
        }

        // names must be equal
        return 0;

    });
}

function getColumnsBySortingIndex<T>(cols: Column<T, unknown>[]) {
    return cols.sort((a, b) => {

        const valueA = a.getSortIndex();
        const valueB = b.getSortIndex();
        if (valueA < valueB) {
            return -1;
        }
        if (valueA > valueB) {
            return 1;
        }
        return 0;
    });
}

function getColumnsForSort<T>(table: TablePrimitive<T>) {
    const topCols = getColumnsBySortingIndex(table.getAllFlatColumns().filter((column) => column.getCanSort() && column.getSortIndex() >= 0))

    const bottomCols = getColumnsByName(table.getAllFlatColumns().filter((column) => column.getCanSort() && column.getSortIndex() < 0))
    const allCols = topCols.concat(bottomCols)
    return allCols
}

function getColumnTitleElement<T>(column: Column<T, unknown>) {
    let title = getColumnTitle(column)
    if (column.id === DataTableConstants.actions) {
        return <div className="flex space-x-1"><span>{title}</span><DotsHorizontalIcon className="h-6 w-6" /></div>
    }
    if (column.id === DataTableConstants.select) {
        return <div className="flex space-x-1"><span>{title}</span><CheckboxIcon className="h-6 w-6" /></div>
    }
    return <span>{title}</span>
}
