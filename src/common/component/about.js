import Navbar from "./navbar";
import BottomBar from "./bottomBar";
import Image from "../../assets/img/bestPropertyMohail.png";

export default function About() {
  window.scroll(0, 0);
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        {/* Header Section */}
        <div className="relative bg-gray-300  py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              About Best Properties Mohali
            </h1>
            <p className="text-lg md:text-xl max-w-3xl mx-auto">
              Your trusted RERA-certified real estate experts in Mohali, Punjab,
              delivering transparent and professional property solutions across
              India.
            </p>
          </div>
        </div>

        {/* Company Overview Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="flex flex-col md:flex-row gap-8 px-4">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-semibold text-gray-800 mb-4">
                Who We Are
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Best Properties Mohali is a trusted group of RERA-certified real
                estate experts and consultants based in Mohali, Punjab. With
                years of market experience and in-depth industry knowledge, we
                specialize in offering reliable, transparent, and professional
                real estate services across a wide range of property segments.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Our platform serves as a bridge between genuine property buyers,
                sellers, investors, builders, and developers, helping everyone
                make informed real estate decisions. We proudly deal in premium
                projects across Mohali, Chandigarh, and major states of India,
                including Punjab, Himachal Pradesh, Haryana, Delhi NCR, Gujarat,
                Madhya Pradesh, and Jammu & Kashmir.
              </p>
            </div>
            <div className="md:w-1/2">
              <img
                src={Image}
                alt="Real Estate"
                className="rounded-lg shadow-lg w-full h-80 object-cover"
              />
            </div>
          </div>
        </div>

        {/* Services Section */}
        <div className="bg-white py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-semibold text-gray-800 text-center mb-12">
              What We Offer
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Residential Sales & Investments",
                  desc: "Flats, Villas, Kothis, Plots",
                },
                {
                  title: "Commercial Properties",
                  desc: "SCOs, Showrooms, Office Spaces",
                },
                {
                  title: "Industrial & Agricultural Land",
                  desc: "Secure and high-value land deals",
                },
                {
                  title: "Builder Tie-ups & Marketing",
                  desc: "Promote projects with our network",
                },
                {
                  title: "End-to-End Support",
                  desc: "From site visits to registry",
                },
                {
                  title: "Investment Advisory",
                  desc: "High-growth opportunities",
                },
              ].map((service, index) => (
                <div
                  key={index}
                  className="p-6 bg-gray-50 rounded-lg shadow-md text-center"
                >
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {service.title}
                  </h3>
                  <p className="text-gray-600">{service.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className="bg-gray-100 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-semibold text-gray-800 text-center mb-12">
              Why Choose Us?
            </h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {[
                "RERA-Certified & Trusted Experts",
                "Widest Access to Properties Across India",
                "Verified Listings & Honest Pricing",
                "Easy Property Posting for Sellers & Builders",
                "Responsive Support Team & Site Visit Assistance",
              ].map((reason, index) => (
                <li key={index} className="flex items-center text-gray-600">
                  <svg
                    className="w-6 h-6 text-blue-600 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {reason}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Call to Action Section */}
        <div className="bg-gray-300  py-16 text-center">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-semibold mb-4">Let’s Connect</h2>
            <p className="text-lg mb-6 max-w-2xl mx-auto">
              Have a property to sell? Looking to invest in the right location?
              Just need advice before buying your dream home? We’re here to
              help.
            </p>
            <a
              href="/contact"
              className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg"
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
