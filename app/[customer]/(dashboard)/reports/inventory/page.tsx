/*
  import SetPageTitle from '@/components/customui/pagetitle';
import { appStore, selectAppData } from "@/lib/store/store"
 */
import SetPageTitle from '@/components/customui/pagetitle';
import { appStore, selectAppData } from "@/lib/store/store"
export default function Inventory() {
    const customer = selectAppData(appStore.getState()).organisation;
    return (
        <div>
            <SetPageTitle title={`Customer ${customer!.name} Inventory Report `} />
            {`Customer ${customer!.name} (Login Required), Display Inventory Report Here`}
        </div>
    )
}
