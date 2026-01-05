import { Card } from "@/components/ui/Card";

export default function PrivacyPage() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>

      <Card className="mb-6">
        <p className="text-gray-600 mb-4">
          Last updated: {new Date().toLocaleDateString()}
        </p>
        <p className="text-gray-600">
          At E-Commerce Store, we are committed to protecting your privacy. This Privacy Policy 
          explains how we collect, use, disclose, and safeguard your information when you visit 
          our website and use our services.
        </p>
      </Card>

      <Card className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Information We Collect</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Personal Information</h3>
            <p className="text-gray-600">
              We collect information that you provide directly to us, including your name, 
              email address, phone number, shipping address, and payment information.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Usage Information</h3>
            <p className="text-gray-600">
              We automatically collect information about how you interact with our website, 
              including pages visited, products viewed, and time spent on the site.
            </p>
          </div>
        </div>
      </Card>

      <Card className="mb-6">
        <h2 className="text-2xl font-bold mb-4">How We Use Your Information</h2>
        <ul className="space-y-2 text-gray-600">
          <li>• To process and fulfill your orders</li>
          <li>• To communicate with you about your orders and account</li>
          <li>• To send you promotional offers and updates (with your consent)</li>
          <li>• To improve our website and services</li>
          <li>• To prevent fraud and ensure security</li>
        </ul>
      </Card>

      <Card className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Data Security</h2>
        <p className="text-gray-600">
          We implement appropriate technical and organizational security measures to protect 
          your personal information against unauthorized access, alteration, disclosure, or destruction.
        </p>
      </Card>

      <Card>
        <h2 className="text-2xl font-bold mb-4">Your Rights</h2>
        <p className="text-gray-600 mb-4">
          You have the right to access, update, or delete your personal information at any time. 
          You can also opt-out of marketing communications by updating your preferences in your account settings.
        </p>
        <p className="text-gray-600">
          If you have any questions about this Privacy Policy, please contact us at privacy@ecommerce.com
        </p>
      </Card>
    </div>
  );
}

