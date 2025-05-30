import React from 'react';
import Navbar from '../common/component/navbar';
import BottomBar from '../common/component/bottomBar';

function DisclaimerPage() {
  window.scroll(0,0);
  const disclaimerData = [
    {
      title: 'Website Disclaimer',
      content: (
        <div>
          The content provided on{' '}
          <a
            href="https://bestpropertiesmohali.com"
            className="text-blue-600 link-hover"
            target="_blank"
            rel="noopener noreferrer"
          >
            BestPropertiesMohali.com
          </a>{' '}
          ("we", "us", "our", or "the Site") is intended solely for general informational and promotional purposes. Property listings, images, prices, offers, specifications, locations, and other related information shown on this Site may be sourced from developers, brokers, agents, third-party websites, or public listings. We do not claim ownership of the properties featured unless explicitly stated.
          <br /><br />
          While we strive to keep information updated and accurate, we make no guarantees regarding the completeness, reliability, or accuracy of the information presented. All users are encouraged to independently verify property details, availability, pricing, and associated terms by contacting us directly. Any decisions made based on the information provided on this Site are done solely at your own risk.
          <br /><br />
          We are not involved in actual real estate transactions and do not assume responsibility for agreements or communications between buyers, sellers, agents, or any third parties.
        </div>
      ),
    },
    {
      title: 'Third-Party Content & Links Disclaimer',
      content: (
        <div>
          This Site may include content, media, or links sourced from third-party platforms or property providers. These links and external sources are provided for reference only. We do not monitor, manifested, or guarantee the accuracy or authenticity of any third-party content. We do not endorse or assume any responsibility for services, products, or claims made by external sources referenced on this Site.
        </div>
      ),
    },
    {
      title: 'Testimonials & Reviews Disclaimer',
      content: (
        <div>
          Any testimonials, reviews, or feedback displayed on the Site reflect the personal experiences of individual users. These experiences are subjective and may not represent typical or guaranteed outcomes for all users. Results and experiences may vary.
        </div>
      ),
    },
    {
      title: 'No Warranties',
      content: (
        <div>
          All content on BestPropertiesMohali.com is provided “as is,” with no express or implied warranties. We make no claims as to the performance, suitability, legality, or condition of any property or third-party offer displayed on the Site.
        </div>
      ),
    },
    {
      title: 'Trademarks & Brand References',
      content: (
        <div>
          Any brand names, builder names, logos, or trademarks shown on this Site are the property of their respective owners. Their inclusion does not imply endorsement or partnership unless specifically stated.
        </div>
      ),
    },
    {
      title: 'Contact Information',
      content: (
        <div>
          For questions, clarifications, or to verify any property information, please contact us directly:
          <div className="mt-2">
            <p>
              📧 <strong>Email</strong>:{' '}
              <a
                href="mailto:bestpropertiesmohali@yahoo.com"
                className="text-blue-600 link-hover"
              >
                bestpropertiesmohali@yahoo.com
              </a>
            </p>
            <p>
              📞 <strong>Phone</strong>:{' '}
              <a
                href="tel:+917719680903"
                className="text-blue-600 link-hover"
              >
                +91-7719680903
              </a>
            </p>
          </div>
        </div>
      ),
    },
  ];

  return (
    <>
    <Navbar/>
    <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center">
        Disclaimer
      </h1>
      <div className="space-y-6">
        {disclaimerData.map((section, index) => (
          <div
            key={index}
            className="p-4 sm:p-6 bg-gray-50 rounded-md card-hover"
          >
            <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-3">
              {section.title}
            </h2>
            <div className="text-gray-600 text-sm sm:text-base leading-relaxed">
              {section.content}
            </div>
          </div>
        ))}
      </div>
    </div>
    <BottomBar/>
    </>

  );
}

export default DisclaimerPage;