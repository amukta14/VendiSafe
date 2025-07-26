import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  MapPin, 
  Shield, 
  AlertTriangle, 
  Users, 
  Settings,
  Home,
  FileText
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const navigationItems = [
  {
    title: "Delhi Map",
    url: createPageUrl("Dashboard"),
    icon: Home,
    description: "Live vendor zones"
  },
  {
    title: "Vendor Portal",
    url: createPageUrl("VendorDashboard"),
    icon: Users,
    description: "Check compliance"
  },
  {
    title: "Report Issues", 
    url: createPageUrl("ReportHygiene"),
    icon: AlertTriangle,
    description: "Hygiene complaints"
  },
  {
    title: "Zone Management",
    url: createPageUrl("AdminDashboard"),
    icon: Settings,
    description: "Admin controls"
  }
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-orange-50 via-white to-green-50">
        <Sidebar className="border-r border-orange-200/50 backdrop-blur-sm bg-white/90">
          <SidebarHeader className="border-b border-orange-200/50 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-xl bg-gradient-to-r from-orange-600 to-green-600 bg-clip-text text-transparent">
                  VendiSafe
                </h2>
                <p className="text-xs text-gray-600 font-medium">Delhi Street Vendor Platform</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-4">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 py-3">
                Navigation
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-2">
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        className={`group hover:bg-gradient-to-r hover:from-orange-50 hover:to-green-50 hover:border-orange-200 transition-all duration-300 rounded-xl p-3 border ${
                          location.pathname === item.url 
                            ? 'bg-gradient-to-r from-orange-100 to-green-100 border-orange-300 shadow-sm' 
                            : 'border-transparent'
                        }`}
                      >
                        <Link to={item.url} className="flex items-center gap-3 w-full">
                          <div className={`p-2 rounded-lg transition-colors ${
                            location.pathname === item.url
                              ? 'bg-gradient-to-r from-orange-500 to-green-600 text-white shadow-sm'
                              : 'bg-gray-100 text-gray-600 group-hover:bg-gradient-to-r group-hover:from-orange-200 group-hover:to-green-200'
                          }`}>
                            <item.icon className="w-4 h-4" />
                          </div>
                          <div className="flex flex-col">
                            <span className="font-semibold text-gray-900">{item.title}</span>
                            <span className="text-xs text-gray-500">{item.description}</span>
                          </div>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup className="mt-8">
              <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 py-3">
                Quick Stats
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <div className="space-y-4 px-3">
                  <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-semibold text-green-800">Legal Zones</span>
                    </div>
                    <div className="text-2xl font-bold text-green-700">12</div>
                    <div className="text-xs text-green-600">Active in Delhi</div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-xl border border-orange-200">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4 text-orange-600" />
                      <span className="text-sm font-semibold text-orange-800">Registered</span>
                    </div>
                    <div className="text-2xl font-bold text-orange-700">247</div>
                    <div className="text-xs text-orange-600">Street vendors</div>
                  </div>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-orange-200/50 p-4">
            <div className="bg-gradient-to-r from-orange-50 to-green-50 p-4 rounded-xl border border-orange-200/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">V</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm">VendiSafe Portal</p>
                  <p className="text-xs text-gray-600">Civic Innovation Platform</p>
                </div>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col">
          <header className="bg-white/80 backdrop-blur-sm border-b border-orange-200/50 px-6 py-4 md:hidden">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-orange-100 p-2 rounded-lg transition-colors duration-200" />
              <h1 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-green-600 bg-clip-text text-transparent">
                VendiSafe
              </h1>
            </div>
          </header>

          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
