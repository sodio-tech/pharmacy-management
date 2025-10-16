"use client";
import React from "react";
import {
    Package,
    FileText,
    ShoppingCart,
    Users,
    BarChart3,
    Shield,
    LogOut,
    CreditCard,
    UserCheck,
    User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { signOut, useSession } from "@/lib/auth-client";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import logo from "../../public/logo.png";

const sidebarItems = [
    { icon: BarChart3, label: "Dashboard", href: "/dashboard" },
    { icon: Package, label: "Inventory", href: "/inventory" },
    { icon: FileText, label: "Prescriptions", href: "/prescriptions" },
    { icon: ShoppingCart, label: "Sales & POS", href: "/sales" },
    { icon: Users, label: "Suppliers", href: "/suppliers" },
    { icon: BarChart3, label: "Reports", href: "/reports" },
    { icon: Shield, label: "Compliance", href: "/compliance" },
    { icon: UserCheck, label: "User Management", href: "/users" },
    { icon: CreditCard, label: "Subscription", href: "/profile?tab=subscription" },
    { icon: User, label: "Profile", href: "/profile" },
];

const Sidebar = () => {
    const { data: session, isPending } = useSession();
    const user = session?.user;
    const pathname = usePathname();
    const router = useRouter();

    return (
        <div className="w-64 bg-white border-r border-[#e5e7eb] flex flex-col">
            {/* Logo */}
            <div className="p-[22px] border-b border-[#e5e7eb]">
                <div className="flex items-center gap-3">
                    <div>
                        <Image src={logo} alt="logo" width={45} height={45} />
                    </div>
                    <div>
                        <h1 className="font-semibold text-[#111827] text-lg">Pharmy</h1>
                        <p className="text-sm text-[#6b7280]">Management System</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4">
                <ul className="space-y-2">
                    {sidebarItems.map((item, index) => {
                        const isDashboard = item.href === "/dashboard";
                        const isActive =
                            pathname === item.href ||
                            pathname.startsWith(item.href + "/") ||
                            (pathname === "/" && isDashboard);
                        return (
                            <li key={index}>
                                <button
                                    onClick={() => router.push(item.href)}
                                    className={cn(
                                        "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors",
                                        isActive
                                            ? "bg-[#0f766e] text-white"
                                            : "text-[#6b7280] hover:bg-[#f3f4f6] hover:text-[#111827]"
                                    )}
                                >
                                    <item.icon className="w-5 h-5" />
                                    <span className="font-medium">{item.label}</span>
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            <div className="p-4 border-t border-[#e5e7eb] flex-shrink-0 bg-white/50">
                {isPending ? (
                    <p className="text-sm text-[#6b7280]">Loading...</p>
                ) : user ? (
                    <>
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-[#0f766e] flex items-center justify-center">
                                <span className="text-white font-semibold text-sm">
                                    {user.name
                                        ? user.name.split(" ").map(n => n[0]).join("").toUpperCase()
                                        : "U"}
                                </span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-[#111827] text-sm truncate">
                                    {user.name || "Unknown User"}
                                </p>
                                <p className="text-xs text-[#6b7280] truncate">
                                    {user.email || "No email"}
                                </p>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start gap-2 text-[#6b7280] hover:text-[#111827] hover:bg-white"
                            onClick={() => signOut({
                                fetchOptions: {
                                    onSuccess: () => {
                                        router.push("/login");
                                    },
                                },
                            })
                            }
                        >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                        </Button>
                    </>
                ) : (
                    <Button
                        variant="default"
                        size="sm"
                        className="w-full"
                        onClick={() => (window.location.href = "/login")}
                    >
                        Sign In
                    </Button>
                )}
            </div>
        </div >
    );
};

export default Sidebar;
