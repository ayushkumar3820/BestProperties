import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
export default function BottomBar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  const handleScroll = () => {
    setIsScrolled(window.scrollY > 200);
  };
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  const phoneNumber = "918360979762";
  const userContactNumber = "Inquiries related to Best Properties";
  const facebookLink = 'https://www.facebook.com/profile.php?id=100091622186994';
  const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    userContactNumber
  )}`;
  const initialWordsToShow = 200;
  const disclaimerText = ` Disclaimer: Best Properties Realty Services Limited is only an intermediary offering its platform to advertise properties of Seller for a Customer/Buyer/User coming on its Website and is not and
  cannot be a party to or privy to or control in any manner any transactions between the Seller and the Customer/Buyer/User. All the offers and discounts on this Website have been extended by various Builder(s)/Developer(s) who have advertised their products. Best Properties is only communicating the offers and not selling or rendering any of those products or services. It neither warrants nor is it making any representations with respect to offer(s) made on
  the site. Best Properties Realty Services Limited shall neither be responsible nor liable to mediate or resolve any disputes or disagreements between the Customer/Buyer/User and the Seller and both Seller and Customer/Buyer/User shall settle all such disputes without involving Best Properties Realty Services Limited in any manner.`; // Your full disclaimer text goes here

  const displayedText = showAll
    ? disclaimerText
    : disclaimerText.slice(0, initialWordsToShow);

  const handleShowMoreClick = () => {
    setShowAll(!showAll);
  };
  return (
    <div className="relative">
      {isScrolled ? (
        <>
          <button
            onClick={scrollToTop}
            className="bg-green-600 fixed bottom-20 right-2 rounded-full mt-2 z-30 h-14 w-14 hover:bg-red-600 flex justify-center items-center p-2 px-2 text-2xl text-white font-bold"
          >
            <div className="right-0 ">
              <svg
                className="h-10 w-12"
                fill="#fff"
                xmlns="http://www.w3.org/2000/svg"
                height="16"
                width="12"
                viewBox="0 0 384 512"
              >
                <path d="M214.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 141.2V448c0 17.7 14.3 32 32 32s32-14.3 32-32V141.2L329.4 246.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160z" />
              </svg>
            </div>
          </button>
          <button></button>
        </>
      ) : null}
      
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className=" fixed  left-5 bottom-0 z-10  "
      >
        <button>
          <div className="right-0">
            <svg
              fill="#25D366"
              // className="w-14 h-14"
              xmlns="http://www.w3.org/2000/svg"
              height="40"
              width="40"
              viewBox="0 0 448 512"
            >
              <path d="M92.1 254.6c0 24.9 7 49.2 20.2 70.1l3.1 5-13.3 48.6L152 365.2l4.8 2.9c20.2 12 43.4 18.4 67.1 18.4h.1c72.6 0 133.3-59.1 133.3-131.8c0-35.2-15.2-68.3-40.1-93.2c-25-25-58-38.7-93.2-38.7c-72.7 0-131.8 59.1-131.9 131.8zM274.8 330c-12.6 1.9-22.4 .9-47.5-9.9c-36.8-15.9-61.8-51.5-66.9-58.7c-.4-.6-.7-.9-.8-1.1c-2-2.6-16.2-21.5-16.2-41c0-18.4 9-27.9 13.2-32.3c.3-.3 .5-.5 .7-.8c3.6-4 7.9-5 10.6-5c2.6 0 5.3 0 7.6 .1c.3 0 .5 0 .8 0c2.3 0 5.2 0 8.1 6.8c1.2 2.9 3 7.3 4.9 11.8c3.3 8 6.7 16.3 7.3 17.6c1 2 1.7 4.3 .3 6.9c-3.4 6.8-6.9 10.4-9.3 13c-3.1 3.2-4.5 4.7-2.3 8.6c15.3 26.3 30.6 35.4 53.9 47.1c4 2 6.3 1.7 8.6-1c2.3-2.6 9.9-11.6 12.5-15.5c2.6-4 5.3-3.3 8.9-2s23.1 10.9 27.1 12.9c.8 .4 1.5 .7 2.1 1c2.8 1.4 4.7 2.3 5.5 3.6c.9 1.9 .9 9.9-2.4 19.1c-3.3 9.3-19.1 17.7-26.7 18.8zM448 96c0-35.3-28.7-64-64-64H64C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V96zM148.1 393.9L64 416l22.5-82.2c-13.9-24-21.2-51.3-21.2-79.3C65.4 167.1 136.5 96 223.9 96c42.4 0 82.2 16.5 112.2 46.5c29.9 30 47.9 69.8 47.9 112.2c0 87.4-72.7 158.5-160.1 158.5c-26.6 0-52.7-6.7-75.8-19.3z" />
            </svg>
          </div>
        </button>
      </a>

      <a href={facebookLink}target="_blank" rel="noopener noreferrer"  style={{bottom: '8%'}} className=" fixed  left-5 bottom-10 z-10" >
        <button>
          <div className="right-0">
          <svg xmlns="http://www.w3.org/2000/svg" height="40"  width="40" viewBox="0 0 512 512"><path fill="#0866ff" d="M512 256C512 114.6 397.4 0 256 0S0 114.6 0 256C0 376 82.7 476.8 194.2 504.5V334.2H141.4V256h52.8V222.3c0-87.1 39.4-127.5 125-127.5c16.2 0 44.2 3.2 55.7 6.4V172c-6-.6-16.5-1-29.6-1c-42 0-58.2 15.9-58.2 57.2V256h83.6l-14.4 78.2H287V510.1C413.8 494.8 512 386.9 512 256h0z"/></svg>
          </div>
        </button>
      </a>





      <div className="bg-[#002C35] shadow dark:bg-gray-900  ">
        <div className="w-full   ">
          <div className="sm:flex justify-center items-center sm:items-center py-4 ">
            <a
              href="https://bestpropertiesmohali.com/stage/"
              className="flex items-center mb-4 sm:mb-0"
            ></a>
            <ul className="flex items-center gap-5 justify-center mb-6 text-sm text-white sm:mb-0 dark:text-gray-400">
              <Link to="/about" className=" text-sm hover:underline   ">
                About
              </Link>
              <Link
                to="/term-and-condition"
                className=" hover:underline  text-sm"
              >
                Terms & Conditions
              </Link>
              <Link to="/privacy-policy" className=" hover:underline  text-sm">
                Privacy Policy
              </Link>
              <Link to="/contact" className="hover:underline text-sm">
                Contact
              </Link>
            </ul>
          </div>
          <div className=" border-white border-dotted border-t-2 dark:border-gray-700 mt-2 "></div>
          <span className="block text-sm  p-2 text-white sm:text-center dark:text-gray-400 mt-4 mx-auto py-4">
            {displayedText}
            {!showAll && (
              <button
                onClick={handleShowMoreClick}
                className="text-blue-600 ml-1 cursor-pointer focus:outline-none"
              >
                Show more
              </button>
            )}
          </span>
        </div>
      </div>
    </div>
  );
}
