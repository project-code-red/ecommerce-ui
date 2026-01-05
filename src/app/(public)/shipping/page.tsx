import { Card } from "@/components/ui/Card";
import { Truck, Clock, Package, Shield } from "lucide-react";

export default function ShippingPage() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-8">Shipping Information</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <Card>
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Truck className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Standard Shipping</h3>
              <p className="text-gray-600">
                Free standard shipping on orders above ₹500. Delivery within 3-5 business days.
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Express Shipping</h3>
              <p className="text-gray-600">
                Fast delivery within 1-2 business days. Additional charges apply.
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Package className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Cash on Delivery</h3>
              <p className="text-gray-600">
                Pay when you receive. Available for orders up to ₹5000.
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Shield className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Secure Packaging</h3>
              <p className="text-gray-600">
                All items are carefully packaged to ensure safe delivery.
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Shipping Rates</h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center py-2 border-b">
            <span className="font-medium">Orders below ₹500</span>
            <span className="text-gray-600">₹50</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b">
            <span className="font-medium">Orders above ₹500</span>
            <span className="text-green-600 font-semibold">FREE</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b">
            <span className="font-medium">Express Shipping</span>
            <span className="text-gray-600">₹150</span>
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="text-2xl font-bold mb-4">Delivery Timeline</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Metro Cities</h3>
            <p className="text-gray-600">3-5 business days</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Tier 2 Cities</h3>
            <p className="text-gray-600">5-7 business days</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Other Locations</h3>
            <p className="text-gray-600">7-10 business days</p>
          </div>
        </div>
      </Card>

      <Card className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Tracking Your Order</h2>
        <p className="text-gray-600 mb-4">
          Once your order is shipped, you'll receive a tracking number via email and SMS. 
          You can track your order status from your account's order history page.
        </p>
        <p className="text-gray-600">
          For any shipping-related queries, please contact our customer support team.
        </p>
      </Card>
    </div>
  );
}

