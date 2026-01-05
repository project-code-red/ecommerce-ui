"use client";

import { useState } from "react";
import { useCurrentUser } from "@/services/queries/authQueries";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addressSchema, type AddressInput } from "@/schemas/addressSchemas";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/ToastProvider";
import { MapPin, Plus, Edit, Trash2 } from "lucide-react";

export default function AddressesPage() {
  const { data: user } = useCurrentUser();
  const { showToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AddressInput>({
    resolver: zodResolver(addressSchema) as any,
  });

  const handleAddAddress = () => {
    setEditingAddress(null);
    reset();
    setIsModalOpen(true);
  };

  const handleEditAddress = (addressId: string) => {
    const address = user?.addresses.find((a) => a.id === addressId);
    if (address) {
      setEditingAddress(addressId);
      reset({
        name: address.name,
        phone: address.phone,
        addressLine1: address.addressLine1,
        addressLine2: address.addressLine2,
        city: address.city,
        state: address.state,
        pincode: address.pincode,
        country: address.country,
        isDefault: address.isDefault,
        type: address.type,
      });
      setIsModalOpen(true);
    }
  };

  const onSubmit = (data: AddressInput) => {
    // Mock save - in real app, this would call an API
    showToast(
      editingAddress ? "Address updated successfully!" : "Address added successfully!",
      "success"
    );
    setIsModalOpen(false);
    reset();
  };

  if (!user) {
    return <div className="px-4 py-8">Loading...</div>;
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">My Addresses</h1>
        <Button onClick={handleAddAddress}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Address
        </Button>
      </div>

      {user.addresses.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">No addresses saved yet</p>
            <Button onClick={handleAddAddress}>Add Your First Address</Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {user.addresses.map((address) => (
            <Card key={address.id}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {address.isDefault && (
                    <span className="inline-block bg-primary text-white text-xs px-2 py-1 rounded mb-2">
                      Default
                    </span>
                  )}
                  <h3 className="font-semibold text-lg mb-2">{address.name}</h3>
                  <p className="text-gray-600 mb-1">{address.phone}</p>
                  <p className="text-gray-600 mb-1">{address.addressLine1}</p>
                  {address.addressLine2 && (
                    <p className="text-gray-600 mb-1">{address.addressLine2}</p>
                  )}
                  <p className="text-gray-600 mb-1">
                    {address.city}, {address.state} {address.pincode}
                  </p>
                  <p className="text-gray-600">{address.country}</p>
                  {address.type && (
                    <p className="text-sm text-gray-500 mt-2">Type: {address.type}</p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditAddress(address.id)}
                    className="p-2 text-primary hover:bg-primary/10 rounded"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => showToast("Address deletion feature coming soon", "info")}
                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          reset();
        }}
        title={editingAddress ? "Edit Address" : "Add New Address"}
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Name"
            {...register("name")}
            error={errors.name?.message}
          />
          <Input
            label="Phone"
            type="tel"
            {...register("phone")}
            error={errors.phone?.message}
          />
          <Input
            label="Address Line 1"
            {...register("addressLine1")}
            error={errors.addressLine1?.message}
          />
          <Input
            label="Address Line 2 (Optional)"
            {...register("addressLine2")}
            error={errors.addressLine2?.message}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="City"
              {...register("city")}
              error={errors.city?.message}
            />
            <Input
              label="State"
              {...register("state")}
              error={errors.state?.message}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Pincode"
              {...register("pincode")}
              error={errors.pincode?.message}
            />
            <Input
              label="Country"
              {...register("country")}
              error={errors.country?.message}
            />
          </div>
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                {...register("isDefault")}
                className="rounded border-gray-300"
              />
              <span className="text-sm">Set as default address</span>
            </label>
          </div>
          <div className="flex justify-end space-x-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsModalOpen(false);
                reset();
              }}
            >
              Cancel
            </Button>
            <Button type="submit">Save Address</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

