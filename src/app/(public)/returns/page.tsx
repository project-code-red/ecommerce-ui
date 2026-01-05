import { Card } from "@/components/ui/Card";
import { RefreshCw, Clock, CheckCircle, XCircle } from "lucide-react";

export default function ReturnsPage() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-8">Returns & Refunds</h1>

      <Card className="mb-8">
        <div className="flex items-start space-x-4 mb-6">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <RefreshCw className="h-6 w-6 text-primary" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-2">10-Day Return Policy</h2>
            <p className="text-gray-600">
              We offer a hassle-free 10-day return policy on most items. If you're not satisfied with your purchase, 
              you can return it within 10 days of delivery.
            </p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <div className="flex items-start space-x-4">
            <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-lg mb-2">Eligible for Return</h3>
              <ul className="text-gray-600 space-y-1 text-sm">
                <li>• Items in original condition</li>
                <li>• With original tags and packaging</li>
                <li>• Unused and unwashed</li>
                <li>• Within 10 days of delivery</li>
              </ul>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-start space-x-4">
            <XCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-lg mb-2">Not Eligible for Return</h3>
              <ul className="text-gray-600 space-y-1 text-sm">
                <li>• Items without tags</li>
                <li>• Used or damaged items</li>
                <li>• Personal care products</li>
                <li>• Customized items</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>

      <Card className="mb-8">
        <h2 className="text-2xl font-bold mb-4">How to Return</h2>
        <div className="space-y-4">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">
              1
            </div>
            <div>
              <h3 className="font-semibold mb-1">Initiate Return</h3>
              <p className="text-gray-600">Go to your order history and click "Return" on the item you want to return.</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">
              2
            </div>
            <div>
              <h3 className="font-semibold mb-1">Pack the Item</h3>
              <p className="text-gray-600">Pack the item in its original packaging with all tags attached.</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">
              3
            </div>
            <div>
              <h3 className="font-semibold mb-1">Schedule Pickup</h3>
              <p className="text-gray-600">We'll arrange a pickup from your address at no extra cost.</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">
              4
            </div>
            <div>
              <h3 className="font-semibold mb-1">Get Refund</h3>
              <p className="text-gray-600">Once we receive and verify the item, your refund will be processed within 5-7 business days.</p>
            </div>
          </div>
        </div>
      </Card>

      <Card className="mb-8">
        <div className="flex items-start space-x-4">
          <Clock className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
          <div>
            <h2 className="text-2xl font-bold mb-2">Refund Processing Time</h2>
            <p className="text-gray-600 mb-2">
              Refunds are processed within 5-7 business days after we receive and verify the returned item.
            </p>
            <p className="text-gray-600">
              The refund will be credited to your original payment method. For Cash on Delivery orders, 
              the refund will be processed via bank transfer.
            </p>
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="text-2xl font-bold mb-4">Exchange Policy</h2>
        <p className="text-gray-600 mb-4">
          We currently do not offer direct exchanges. If you need a different size or color, 
          please return the item and place a new order for the desired item.
        </p>
        <p className="text-gray-600">
          For any return-related queries, please contact our customer support team.
        </p>
      </Card>
    </div>
  );
}

