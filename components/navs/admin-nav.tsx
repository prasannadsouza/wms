import * as React from "react"
import Link from "next/link"

/*
import { cn, getOrgURL } from "@/lib/utils"
import { NavigationBar, getMenuIconClass } from "@/components/navs/navigationbar"
import { appStore, selectAppData } from "@/lib/store/store"
import { appDataSlice } from "@/lib/store/appDataSlice"
import { Auth as AuthRequest, AppUser } from "@/lib/types/request"
import { ResponseData } from "@/lib/types/types"
import { validateUser, } from "@/lib/server/admin/authutil"
import { deleteAuthCookie, setAuthCookie } from "@/lib/server/util"
import { App as AdminConstants } from '@/lib/types/admin/constants';
import { Pages } from "@/lib/types/admin/constants"
import { NavigationMenuLink } from "@/components/ui/navigation-menu"
import { MenubarItem, MenubarSeparator, MenubarSub, MenubarSubContent, MenubarSubTrigger, MenubarPortal, MenubarContent, } from "@/components/ui/menubar"
import { Warehouse, Users2, Settings, Globe, Scroll, Send } from "lucide-react";
import LogoutButton from "@/components/navs/logout"
import { errorCodes } from '@/lib/types/errorcodes'

 */

import { cn, getOrgURL } from "@/lib/utils"
import { NavigationBar, getMenuIconClass } from "@/components/navs/navigationbar"
import { appStore, selectAppData } from "@/lib/store/store"
import { appDataSlice } from "@/lib/store/appDataSlice"
import { Auth as AuthRequest, AppUser } from "@/lib/types/request"
import { ResponseData } from "@/lib/types/types"
import { validateUser, } from "@/lib/server/admin/authutil"
import { deleteAuthCookie, setAuthCookie } from "@/lib/server/util"
import { App as AdminConstants } from '@/lib/types/admin/constants';
import { Pages } from "@/lib/types/admin/constants"
import { NavigationMenuLink } from "@/components/ui/navigation-menu"
import { MenubarItem, MenubarSeparator, MenubarSub, MenubarSubContent, MenubarSubTrigger, MenubarPortal, MenubarContent, } from "@/components/ui/menubar"
import { Warehouse, Users2, Settings, Globe, Scroll, Send } from "lucide-react";
import LogoutButton from "@/components/navs/logout"
import { errorCodes } from '@/lib/types/errorcodes'


function MainMenuContent() {
    const appData = selectAppData(appStore.getState());

    if (!appData?.loggedInUser) return null;

    return (<MenubarContent align="start" sideOffset={5} alignOffset={-3}>
        <Link href="/admin/admins" legacyBehavior passHref>
            <NavigationMenuLink>
                <MenubarItem className="hover:border-2">
                    <Users2 className={"mr-1"} />
                    Users
                </MenubarItem>
            </NavigationMenuLink>
        </Link>
        <Link href="/admin/customers" legacyBehavior passHref>
            <NavigationMenuLink>
                <MenubarItem className="hover:border-2">
                    <Warehouse className={"mr-1"} />
                    Customers
                </MenubarItem>
            </NavigationMenuLink>
        </Link>
        <MenubarItem className="hover:border-2"> New Window{' '}
            <div className={getMenuIconClass()}>⌘ N </div>
        </MenubarItem>
        <MenubarItem className="hover:border-2" disabled>New Incognito Window</MenubarItem>
        <MenubarSeparator />
        <MenubarSub><MenubarSubTrigger className="hover:border-2">
            Share
        </MenubarSubTrigger>
            <MenubarPortal>
                <MenubarSubContent alignOffset={-5} >
                    <MenubarItem className="hover:border-2"> Email Link </MenubarItem>
                    <MenubarItem className="hover:border-2">Messages </MenubarItem>
                    <MenubarItem className="hover:border-2"> Notes </MenubarItem>
                </MenubarSubContent>
            </MenubarPortal>
        </MenubarSub>
        <MenubarSeparator />
        <MenubarItem className="hover:border-2"> Print…{' '}
            <div className={getMenuIconClass()}> ⌘ P </div>
        </MenubarItem>
    </MenubarContent>)
}

function UserMenuContent() {
    if (!selectAppData(appStore.getState()).loggedInUser) return null;

    async function performLogout() {
        'use server'
        await deleteAuthCookie(AdminConstants.orgId)
        const { setLoggedInUser } = appDataSlice.actions
        appStore.dispatch(setLoggedInUser(null))

        console.log({
            component: "UserMenuContent!performLogout",
            returnurl: getOrgURL(AdminConstants.orgId, "")
        })
    }

    return (<MenubarContent align="start" sideOffset={5} alignOffset={-3}>
        <MenubarItem className="hover:border-2" > <Settings className={"mr-1"} />Preferences</MenubarItem>
        <MenubarItem className="hover:border-2"> <Globe className={"mr-1"} />Language</MenubarItem>
        <MenubarSeparator />
        <MenubarItem className="hover:border-2"> <Scroll className={"mr-1"} />Help</MenubarItem>
        <MenubarItem className="hover:border-2"> <Send className={"mr-1"} />Support</MenubarItem>
        <MenubarSeparator />
        <LogoutButton performLogout={performLogout} rootURL={getOrgURL(AdminConstants.orgId, "")} />


    </MenubarContent>)
}

export function AdminNav() {

    async function performLogin(loginRequest: AuthRequest): Promise<ResponseData<AppUser | null>> {

        "use server";
        const validateResponse = await validateUser(loginRequest);
        const response: ResponseData<AppUser> = {
            data: null,
            errors: [],
        }

        if (validateResponse.errors?.length) {
            response.errors = validateResponse.errors;
            return response;
        }

        let user = validateResponse.data;
        if (!user) {
            response.errors!.push({
                moduleCode: errorCodes.moduleCode,
                errorCode: errorCodes.username_cannotbe_blank,
            })
            return response;
        }

        response.data = {
            firstName: user!.firstName,
            lastName: user!.lastName,
            postLoginURL: getOrgURL(AdminConstants.orgId, Pages.home)
        }

        if (user?.postLoginURL?.length) response.data.postLoginURL = getOrgURL(AdminConstants.orgId, user.postLoginURL);

        const { setLoggedInUser } = appDataSlice.actions
        await setAuthCookie(AdminConstants.orgId, user!.id!)
        appStore.dispatch(setLoggedInUser(response.data))
        return response;
    }
    return (<NavigationBar
        mainMenuContent={MainMenuContent()}
        userMenuContent={UserMenuContent()}
        fnValidateUser={performLogin}
    />)
}

const ListItem = React.forwardRef<
    React.ElementRef<"a">,
    React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
    return (
        <li>
            <NavigationMenuLink asChild>
                <a
                    ref={ref}
                    className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                        className
                    )}                    {...props} >
                    <div className="text-sm font-medium leading-none">{title}</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        {children}
                    </p>
                </a>
            </NavigationMenuLink>
        </li>
    )
})
ListItem.displayName = "ListItem"
