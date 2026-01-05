"use client";

import Link from "next/link";
import { useCurrentUser } from "@/services/queries/authQueries";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Package, MapPin, Heart, ShoppingBag } from "lucide-react";

export default function ProfilePage() {
  const { data: user } = useCurrentUser();

  if (!user) {
    return <div className="px-4 py-8">Loading...</div>;
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 max-w-7xl mx-auto">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 sm:mb-8 text-gray-900">My Account</h1>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <Link href="/user/orders">
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full p-4 sm:p-6">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <ShoppingBag className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-sm sm:text-base text-gray-900">My Orders</h3>
                <p className="text-xs sm:text-sm text-gray-600 mt-0.5">View order history</p>
              </div>
            </div>
          </Card>
        </Link>

        <Link href="/user/addresses">
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full p-4 sm:p-6">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-sm sm:text-base text-gray-900">Addresses</h3>
                <p className="text-xs sm:text-sm text-gray-600 mt-0.5">Manage addresses</p>
              </div>
            </div>
          </Card>
        </Link>

        <Link href="/user/wishlist">
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full p-4 sm:p-6">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Heart className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-sm sm:text-base text-gray-900">Wishlist</h3>
                <p className="text-xs sm:text-sm text-gray-600 mt-0.5">Saved items</p>
              </div>
            </div>
          </Card>
        </Link>

        <Link href="/user/cart">
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full p-4 sm:p-6">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Package className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-sm sm:text-base text-gray-900">Shopping Cart</h3>
                <p className="text-xs sm:text-sm text-gray-600 mt-0.5">View cart</p>
              </div>
            </div>
          </Card>
        </Link>
      </div>

      {/* Profile Information */}
      <Card className="mb-6 sm:mb-8 p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-900">Profile Information</h2>
        <div className="space-y-4 sm:space-y-5">
          <div>
            <label className="text-xs sm:text-sm font-medium text-gray-600 block mb-1">Name</label>
            <p className="text-base sm:text-lg text-gray-900">{user.name}</p>
          </div>
          <div>
            <label className="text-xs sm:text-sm font-medium text-gray-600 block mb-1">Email</label>
            <p className="text-base sm:text-lg text-gray-900 break-words">{user.email}</p>
          </div>
          {user.phone && (
            <div>
              <label className="text-xs sm:text-sm font-medium text-gray-600 block mb-1">Phone</label>
              <p className="text-base sm:text-lg text-gray-900">{user.phone}</p>
            </div>
          )}
          <div className="pt-2 sm:pt-4">
            <Button variant="outline" className="w-full sm:w-auto text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-2.5">
              Edit Profile
            </Button>
          </div>
        </div>
      </Card>

      {/* Recent Orders Preview */}
      <Card className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Recent Orders</h2>
          <Link href="/user/orders" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-2.5">
              View All Orders
            </Button>
          </Link>
        </div>
        <p className="text-sm sm:text-base text-gray-600">
          <Link href="/user/orders" className="text-primary hover:underline">
            Click here to view your order history
          </Link>
        </p>
      </Card>
    </div>
  );
}

