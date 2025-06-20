import Navbar from "./navbar";
import BottomBar from "./bottomBar";

export default function About() {
  window.scroll(0, 0);
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white py-24">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 animate-fade-in">
              About Best Properties Mohali
            </h1>
            <p className="text-lg md:text-2xl max-w-2xl mx-auto opacity-90">
              Trusted RERA-certified real estate experts delivering seamless property solutions across India.
            </p>
          </div>
        </div>

        {/* Company Overview Section */}
        <div className="container mx-auto px-6 py-20">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Who We Are
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              Best Properties Mohali is a leading group of RERA-certified real estate professionals based in Mohali, Punjab. With extensive market expertise, we provide transparent and reliable services across diverse property segments.
            </p>
            <p className="text-gray-700 text-lg leading-relaxed">
              Our platform connects genuine buyers, sellers, investors, builders, and developers, enabling informed decisions. We handle premium projects in Mohali, Chandigarh, and states like Punjab, Haryana, Delhi NCR, Gujarat, Madhya Pradesh, Himachal Pradesh, and Jammu & Kashmir through our robust network.
            </p>
          </div>
        </div>

        {/* Services Section */}
        <div className="bg-gray-50 py-20">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
              What We Offer
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: "Residential Sales & Investments", desc: "Explore flats, villas, kothis, and plots tailored to your needs." },
                { title: "Commercial Properties", desc: "Invest in SCOs, showrooms, and office spaces for growth." },
                { title: "Industrial & Agricultural Land", desc: "Secure high-value land deals with expert guidance." },
                { title: "Builder Tie-ups & Marketing", desc: "Amplify projects through our extensive network." },
                { title: "End-to-End Support", desc: "From site visits to registry, we’ve got you covered." },
                { title: "Investment Advisory", desc: "Unlock high-growth opportunities with our insights." },
              ].map((service, index) => (
                <div
                  key={index}
                  className="p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                >
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">{service.title}</h3>
                  <p className="text-gray-600">{service.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className="container mx-auto px-6 py-20">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
            Why Choose Us?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              "RERA-Certified & Trusted Experts",
              "Nationwide Property Access",
              "Verified Listings with Transparent Pricing",
              "Effortless Property Listing for Sellers",
              "Dedicated Support & Site Visit Assistance",
            ].map((reason, index) => (
              <div
                key={index}
                className="flex items-start space-x-4 p-4 bg-blue-50 rounded-lg animate-slide-up"
              >
                <svg
                  className="w-6 h-6 text-blue-600 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-gray-700 text-lg">{reason}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action Section */}
        <div className="bg-gradient-to-r from-indigo-800 to-blue-700 text-white py-20">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Let’s Connect</h2>
            <p className="text-lg mb-8 max-w-xl mx-auto">
              Ready to buy, sell, or invest? Need expert advice for your dream property? We’re here to make it happen.
            </p>
            <a
              href="/contact"
              className="inline-block bg-white text-blue-700 font-semibold py-3 px-10 rounded-full hover:bg-gray-100 transition-colors duration-300"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
      <BottomBar />
    </>
  );
}