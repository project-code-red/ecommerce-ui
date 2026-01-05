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
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">My Account</h1>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Link href="/user/orders">
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <ShoppingBag className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">My Orders</h3>
                <p className="text-sm text-gray-600">View order history</p>
              </div>
            </div>
          </Card>
        </Link>

        <Link href="/user/addresses">
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Addresses</h3>
                <p className="text-sm text-gray-600">Manage addresses</p>
              </div>
            </div>
          </Card>
        </Link>

        <Link href="/user/wishlist">
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Wishlist</h3>
                <p className="text-sm text-gray-600">Saved items</p>
              </div>
            </div>
          </Card>
        </Link>

        <Link href="/user/cart">
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Shopping Cart</h3>
                <p className="text-sm text-gray-600">View cart</p>
              </div>
            </div>
          </Card>
        </Link>
      </div>

      {/* Profile Information */}
      <Card className="mb-8">
        <h2 className="text-2xl font-bold mb-6">Profile Information</h2>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-600">Name</label>
            <p className="text-lg">{user.name}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Email</label>
            <p className="text-lg">{user.email}</p>
          </div>
          {user.phone && (
            <div>
              <label className="text-sm font-medium text-gray-600">Phone</label>
              <p className="text-lg">{user.phone}</p>
            </div>
          )}
          <div className="pt-4">
            <Button variant="outline">Edit Profile</Button>
          </div>
        </div>
      </Card>

      {/* Recent Orders Preview */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Recent Orders</h2>
          <Link href="/user/orders">
            <Button variant="outline">View All Orders</Button>
          </Link>
        </div>
        <p className="text-gray-600">
          <Link href="/user/orders" className="text-primary hover:underline">
            Click here to view your order history
          </Link>
        </p>
      </Card>
    </div>
  );
}

