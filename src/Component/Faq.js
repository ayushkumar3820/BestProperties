import { useState } from 'react';
import Navbar from '../common/component/navbar';
import OurServices from '../common/component/ourServices';
import Searching from '../common/component/searching';
import BottomBar from '../common/component/bottomBar';

const faqData = [
  { question: "1. Why should I invest in Mohali real estate?", answer: "Mohali is a fast-growing city with modern infrastructure, IT hubs, and great investment potential." },
  { question: "2. What types of properties are available in Mohali?", answer: "You can find apartments, villas, commercial spaces, and plots in Mohali." },
  { question: "3. What makes Mohali a good place to live?", answer: "Mohali has good schools, hospitals, IT parks, shopping malls, and a peaceful environment." },
  { question: "4. Are there budget-friendly properties in Mohali?", answer: "Yes, there are options for all budgets, from affordable apartments to luxury villas." },
  { question: "5. Is Mohali safe for families?", answer: "Yes, Mohali is known for being a safe and family-friendly city with secure neighborhoods." },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
    <Navbar/>
    <div className="container">
    <div className="max-w-4xl mx-auto my-10 p-6 bg-gray-100 rounded-lg shadow-lg">
    
      <h2 className="text-2xl font-bold text-center mb-6">Frequently Asked Questions</h2>
      <div className="space-y-4">
        {faqData.map((faq, index) => (
          <div key={index} className="border-b border-gray-300">
            <button
              className="w-full text-left p-4 bg-white rounded-lg shadow flex justify-between items-center"
              onClick={() => toggleFAQ(index)}
            >
              <span className="text-lg font-semibold">{faq.question}</span>
              <span className="text-xl">{openIndex === index ? '✕' : '+'}</span>
            </button>
            {openIndex === index && (
              <div className="p-4 bg-gray-50 text-gray-700">{faq.answer}</div>
            )}
          </div>
        ))}
      </div>
      </div>
    </div>
    <OurServices/>
    <Searching/>
    <BottomBar/>
    </>
  );
}
