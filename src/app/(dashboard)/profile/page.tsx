"use client";

import { useSearchParams, useRouter } from "next/navigation";
import LayoutSkeleton from "@/components/layout-skeleton";
import DynamicHeader from "@/components/DynamicHeader";
import { Button } from "@/components/ui/button";
import {
    Bell,
    HelpCircle,
    User,
    Shield,
    CreditCard,
    Building2,
    BellRing,
} from "lucide-react";
import Profile from "./components/Profile";
import Security from "./components/Security";
import Organization from "./components/Organization";
import Subscription from "./components/Subscription";

type TabType =
    | "profile"
    | "security"
    | "subscription"
    | "organization"

export default function AdminProfilePage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const activeTab = (searchParams.get("tab") as TabType) || "profile";

    const tabs = [
        { id: "profile" as TabType, label: "Profile", icon: User },
        { id: "security" as TabType, label: "Security", icon: Shield },
        { id: "subscription" as TabType, label: "Subscription", icon: CreditCard },
        { id: "organization" as TabType, label: "Organization", icon: Building2 },
    ];

    return (
        <LayoutSkeleton
            header={
                <DynamicHeader
                    maintext="Admin Profile"
                    para="Manage your account, organization, and subscription"
                    children={
                        <div className="flex items-center gap-3">
                            <Button variant="ghost" size="icon" className="relative">
                                <Bell className="w-5 h-5 text-[#6b7280]" />
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#dc2626] text-white text-xs rounded-full flex items-center justify-center font-medium">
                                    2
                                </span>
                            </Button>
                            <Button variant="ghost" size="icon">
                                <HelpCircle className="w-5 h-5 text-[#6b7280]" />
                            </Button>
                        </div>
                    }
                />
            }
        >
            <div className="max-w-7xl mx-auto">
                {/* Tabs Navigation */}
                <div className="border-b border-[#e5e7eb] -mx-6 px-6">
                    <div className="flex gap-8">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => router.push(`?tab=${tab.id}`)}
                                    className={`flex items-center gap-2 py-4 border-b-2 transition-colors ${activeTab === tab.id
                                            ? "border-[#0f766e] text-[#0f766e]"
                                            : "border-transparent text-[#6b7280] hover:text-[#374151]"
                                        }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    <span className="font-medium">{tab.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Profile Content */}
                {activeTab === "profile" && <Profile />}

                {activeTab === "security" && (
                    <Security />
                )}
                {activeTab === "subscription" && (
                    <Subscription />
                )}
                {activeTab === "organization" && (
                    <Organization />
                )}
            </div>
        </LayoutSkeleton>
    );
}
