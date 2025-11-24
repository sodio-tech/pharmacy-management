import { Suspense } from "react";
import LayoutSkeleton from "@/components/layout-skeleton";
import DynamicHeader from "@/components/DynamicHeader";
// import { Button } from "@/components/ui/button";
// import {
//     Bell,
//     HelpCircle,
// } from "lucide-react";
import ProfileContent from "./components/ProfileContent";

export default function AdminProfilePage() {
    return (
        <LayoutSkeleton
            header={
                <DynamicHeader
                    maintext="Admin Profile"
                    para="Manage your account, organization, and subscription"
                    // children={
                    //     <div className="hidden lg:flex items-center gap-3">
                    //         <Button variant="ghost" size="icon" className="relative">
                    //             <Bell className="w-5 h-5 text-[#6b7280]" />
                    //             <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#dc2626] text-white text-xs rounded-full flex items-center justify-center font-medium">
                    //                 2
                    //             </span>
                    //         </Button>
                    //         <Button variant="ghost" size="icon">
                    //             <HelpCircle className="w-5 h-5 text-[#6b7280]" />
                    //         </Button>
                    //     </div>
                    // }
                />
            }
        >
            <Suspense fallback={<div className="flex items-center justify-center h-64">Loading...</div>}>
                <ProfileContent />
            </Suspense>
        </LayoutSkeleton>
    );
}
