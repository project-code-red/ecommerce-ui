"use client";

import { useState } from "react";
import { useUsers, useUpdateUserRole } from "@/services/queries/adminQueries";
import { Badge } from "@/components/ui/Badge";
import { Select } from "@/components/ui/Select";
import { useToast } from "@/components/ui/ToastProvider";
import { formatDate } from "@/lib/utils";
import { User, UserRole } from "@/types/user";

const roleColors: Record<UserRole, "default" | "success" | "warning" | "danger" | "info"> = {
  super_admin: "danger",
  admin: "warning",
  staff: "info",
  delivery_staff: "default",
  user: "default",
};

const roleOptions: { value: UserRole; label: string }[] = [
  { value: "user", label: "User" },
  { value: "staff", label: "Staff" },
  { value: "admin", label: "Admin" },
  { value: "super_admin", label: "Super Admin" },
  { value: "delivery_staff", label: "Delivery Staff" },
];

export default function AdminUsersPage() {
  const { data: users, isLoading } = useUsers();
  const updateRole = useUpdateUserRole();
  const { showToast } = useToast();

  const handleRoleUpdate = (userId: string, newRole: UserRole) => {
    updateRole.mutate(
      { id: userId, role: newRole },
      {
        onSuccess: () => {
          showToast("User role updated successfully", "success");
        },
        onError: () => {
          showToast("Failed to update user role", "error");
        },
      }
    );
  };

  if (isLoading) {
    return <div className="px-4 py-8">Loading...</div>;
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Users</h1>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Joined
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users?.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    <div className="text-xs text-gray-500">ID: {user.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.phone || "-"}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={roleColors[user.role] || "default"}>
                      {user.role.replace(/_/g, " ").toUpperCase()}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatDate(user.createdAt)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Select
                      options={roleOptions}
                      value={user.role}
                      onChange={(e) => handleRoleUpdate(user.id, e.target.value as UserRole)}
                      className="w-40"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

