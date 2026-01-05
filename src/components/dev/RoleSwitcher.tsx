"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { setCurrentUser } from "@/lib/auth";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { User, Shield, UserCheck } from "lucide-react";
import { AuthUser } from "@/types/user";

const testUsers: AuthUser[] = [
  {
    id: "user-1",
    name: "John Doe",
    email: "john@example.com",
    phone: "9876543210",
    role: "user",
    token: "mock-token-user-1",
  },
  {
    id: "admin-1",
    name: "Admin User",
    email: "admin@example.com",
    phone: "9876543212",
    role: "super_admin",
    token: "mock-token-admin-1",
  },
  {
    id: "admin-2",
    name: "Staff User",
    email: "staff@example.com",
    phone: "9876543213",
    role: "admin",
    token: "mock-token-admin-2",
  },
];

export function RoleSwitcher() {
  const { user, setUser } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);

  const handleSwitchUser = (testUser: AuthUser) => {
    setCurrentUser(testUser);
    setUser(testUser);
    setIsOpen(false);
    
    // Redirect based on role
    if (["super_admin", "admin", "staff"].includes(testUser.role)) {
      window.location.href = "/admin/dashboard";
    } else {
      window.location.href = "/";
    }
  };

  if (!user) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 min-w-[280px]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Shield className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold text-gray-900">Quick Role Switch</h3>
          </div>
          <Badge variant={user.role === "user" ? "default" : "warning"}>
            {user.role.replace(/_/g, " ").toUpperCase()}
          </Badge>
        </div>
        
        <div className="space-y-2">
          <p className="text-xs text-gray-600 mb-2">Current: {user.name}</p>
          
          {testUsers.map((testUser) => (
            <button
              key={testUser.id}
              onClick={() => handleSwitchUser(testUser)}
              disabled={user.id === testUser.id}
              className={`w-full flex items-center space-x-2 px-3 py-2 rounded text-sm transition-colors ${
                user.id === testUser.id
                  ? "bg-primary/10 text-primary cursor-not-allowed"
                  : "bg-gray-50 hover:bg-gray-100 text-gray-700"
              }`}
            >
              {testUser.role === "user" ? (
                <User className="h-4 w-4" />
              ) : (
                <Shield className="h-4 w-4" />
              )}
              <div className="flex-1 text-left">
                <div className="font-medium">{testUser.name}</div>
                <div className="text-xs text-gray-500">{testUser.email}</div>
              </div>
              <Badge variant="default" className="text-xs">
                {testUser.role.replace(/_/g, " ")}
              </Badge>
            </button>
          ))}
        </div>

        <div className="mt-3 pt-3 border-t">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => {
              setCurrentUser(null);
              setUser(null);
              window.location.href = "/";
            }}
          >
            <UserCheck className="h-4 w-4 mr-2" />
            Logout All
          </Button>
        </div>
      </div>
    </div>
  );
}

