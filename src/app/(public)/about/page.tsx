import { Card } from "@/components/ui/Card";

export default function AboutPage() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-8">About Us</h1>

      <Card className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Our Story</h2>
        <p className="text-gray-600 mb-4">
          Welcome to E-Commerce Store, your one-stop destination for all your shopping needs. 
          We are committed to providing you with the best products, exceptional customer service, 
          and a seamless shopping experience.
        </p>
        <p className="text-gray-600">
          Since our inception, we have been dedicated to offering high-quality products across 
          various categories including fashion, electronics, home & kitchen, and more. Our mission 
          is to make online shopping convenient, affordable, and enjoyable for everyone.
        </p>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <h3 className="font-semibold text-lg mb-2">Our Mission</h3>
          <p className="text-gray-600">
            To provide customers with quality products at competitive prices while delivering 
            exceptional service and building lasting relationships.
          </p>
        </Card>
        <Card>
          <h3 className="font-semibold text-lg mb-2">Our Vision</h3>
          <p className="text-gray-600">
            To become the most trusted and preferred online shopping destination, known for 
            quality, reliability, and customer satisfaction.
          </p>
        </Card>
        <Card>
          <h3 className="font-semibold text-lg mb-2">Our Values</h3>
          <p className="text-gray-600">
            Integrity, customer-first approach, innovation, and commitment to excellence 
            guide everything we do.
          </p>
        </Card>
      </div>

      <Card>
        <h2 className="text-2xl font-bold mb-4">Why Choose Us?</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Wide Selection</h3>
            <p className="text-gray-600">
              Browse through thousands of products across multiple categories, all in one place.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Quality Assurance</h3>
            <p className="text-gray-600">
              Every product is carefully selected and quality-checked before reaching you.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Fast Delivery</h3>
            <p className="text-gray-600">
              Quick and reliable shipping to get your orders to you as fast as possible.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Customer Support</h3>
            <p className="text-gray-600">
              Our dedicated support team is here to help you with any questions or concerns.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

