/*
import { AdminUserTable } from "@/components/tables/admin-user-table";
import { appStore } from "@/lib/store/store"
import { appDataSlice } from "@/lib/store/appDataSlice"
*/

import { AdminUserTable } from "@/components/tables/admin-user-table";
import { appStore } from "@/lib/store/store"
import { appDataSlice } from "@/lib/store/appDataSlice"
export default function AdminHome() {
    const { setCurrentTitle } = appDataSlice.actions
    appStore.dispatch(setCurrentTitle("Admins"))

    return (
        <AdminUserTable />
    );
}
