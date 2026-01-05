import { Card } from "@/components/ui/Card";

export default function TermsPage() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>

      <Card className="mb-6">
        <p className="text-gray-600 mb-4">
          Last updated: {new Date().toLocaleDateString()}
        </p>
        <p className="text-gray-600">
          Please read these Terms of Service carefully before using our website. By accessing 
          or using our service, you agree to be bound by these terms.
        </p>
      </Card>

      <Card className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Acceptance of Terms</h2>
        <p className="text-gray-600">
          By accessing and using this website, you accept and agree to be bound by the terms 
          and provision of this agreement. If you do not agree to these terms, please do not use our service.
        </p>
      </Card>

      <Card className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Use License</h2>
        <p className="text-gray-600 mb-4">
          Permission is granted to temporarily access the materials on our website for personal, 
          non-commercial transitory viewing only.
        </p>
        <p className="text-gray-600">
          This license shall automatically terminate if you violate any of these restrictions and 
          may be terminated by us at any time.
        </p>
      </Card>

      <Card className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Product Information</h2>
        <p className="text-gray-600 mb-4">
          We strive to provide accurate product descriptions and images. However, we do not 
          warrant that product descriptions or other content on this site is accurate, complete, 
          reliable, current, or error-free.
        </p>
        <p className="text-gray-600">
          Prices and availability of products are subject to change without notice.
        </p>
      </Card>

      <Card className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Payment Terms</h2>
        <p className="text-gray-600 mb-4">
          Payment must be received before we ship your order. We accept various payment methods 
          including credit cards, debit cards, UPI, and cash on delivery.
        </p>
        <p className="text-gray-600">
          All prices are in Indian Rupees (INR) unless otherwise stated.
        </p>
      </Card>

      <Card className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Limitation of Liability</h2>
        <p className="text-gray-600">
          In no event shall E-Commerce Store or its suppliers be liable for any damages 
          (including, without limitation, damages for loss of data or profit, or due to business 
          interruption) arising out of the use or inability to use the materials on our website.
        </p>
      </Card>

      <Card>
        <h2 className="text-2xl font-bold mb-4">Contact Information</h2>
        <p className="text-gray-600">
          If you have any questions about these Terms of Service, please contact us at 
          legal@ecommerce.com
        </p>
      </Card>
    </div>
  );
}

