'use client'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import { DataTableColumnHeader } from "./data-column-header";
import { DataTable } from "./data-table";
import { appStore, selectAppData } from "@/lib/store/store"

export type Customer = {
    id: string,
    name: string,
    email: string,
    count: number,
};

const customers: Customer[] = [
    {
        id: "most",
        name: "Malmo Ost",
        count: 1,
        email: "mo@most.com",
    },
    {
        id: "ikea",
        name: "IKEA",
        count: 4,
        email: "ik@ikea.com",
    },
    {
        id: "bata",
        name: "BATA",
        count: 2,
        email: "ba@bata.com",
    },
];

const columns = [
    {
        accessorKey: "id",
        header: "ID"
    },
    {
        accessorKey: "email",
        header: ({ column }: { column: any }) => (
            <DataTableColumnHeader column={column} title="Email" />
        ),
    },
    {
        accessorKey: "name",
        header: ({ column }: { column: any }) => (
            <DataTableColumnHeader column={column} title="Name" />
        ),
    },
    {
        accessorKey: "count",
        header: ({ column }: { column: any }) => (
            <DataTableColumnHeader column={column} title="Count" />
        ),
    },
    {
        id: "actions",
        cell: ({ row }: { row: any }) => {
            const payment = row.original

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(payment.id)}
                        >
                            Copy payment ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>View customer</DropdownMenuItem>
                        <DropdownMenuItem>View payment details</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]

export function AdminCustomerTable() {
    const appData = selectAppData(appStore.getState());
    console.log({
        component: "AdminCustomerTable",
        appData: appData
    })
    return (
        <DataTable columns={columns} data={customers} />
    );
}
