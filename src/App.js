import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Main from "./Component/main";
import "../src/App.css";
import Contact from "./common/component/ContactUs";
import PrivacyPolicy from "./common/privacy-policy";
import UserInformation from "./common/component/userInformation";
import Gallery from "./common/component/Gallery";
import Login from "./common/component/login";
import OtpScreen from "./common/component/otpScreen";
import AboutProperty from "./common/component/aboutProperty";
// import Buyer from "./common/component/Buyer";
// import LoactionPage from "./common/component/loaction";
import Budget from "./common/component/budget";
import Requirment from "./common/component/requirment";
import "../src/App.css";
import BuyerTwo from "./common/component/buyerTwo";
import Sucess from "./common/sucess";
import Residential from "./common/component/residential";
import LandingPage from "./common/component/landingPage";
import NotFound from "./common/component/NotFound";
import Property from "./common/component/Property";
// import Agent from "./Component/agent";
import Search from "./Component/search";
import Rent from "./Component/rent";
import RentDetails from "./Component/rentdetails";
import TermandCondition from "./common/component/termandcondition";
import About from "./common/component/about";
import ProjectDetails from "./Component/ProjectDetails";
import Projects from "./Component/Projects";
import SingleProperty from "./Component/SingleProperty";
import AgentProperties from "./Component/AgentProperties";
import AgentPropertiesDetails from "./Component/AgentPropertiesDetails";
import EMICalculator from "./Component/EMICalculator";
import FAQ from "./Component/Faq";
// import DataDeletion from "./common/dataDeletion ";
import Disclaimer from "./Component/Disclaimer";
import SellWithUsModal from "./common/component/SellWithUsModal";
import ForgetPassword from "./common/component/forgetPassword";
import HomeLoan from "./common/component/HomeLoan";
import WishlistPage from "./common/component/wishList";
import Dashboards from "./common/component/dashboards";
import RequestProperties from "./common/component/RequestProperties";

export default function App() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="contact/" element={<Contact />} />
        <Route path="faq/" element={<FAQ />} />
        <Route path="privacy-policy/" element={<PrivacyPolicy />} />
        {/* <Route path="data-deletion/" element={<DataDeletion />} /> */}
        <Route path="/single-property/:id" element={<SingleProperty />} />
        <Route path="/project-details/:id" element={<ProjectDetails />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/loan-emi-calculator" element={<EMICalculator />} />
        <Route path="/agent-properties" element={<AgentProperties />} />
        <Route
          path="/agent-propertie-details"
          element={<AgentPropertiesDetails />}
        />
        <Route path="term-and-condition/" element={<TermandCondition />} />
        <Route path="about/" element={<About />} />
        <Route path="property/:id" element={<UserInformation />} />
        <Route path="gallery/" element={<Gallery />} />
        <Route path="login/" element={<Login />} />
        <Route path="otpscreen/" element={<OtpScreen />} />
        <Route path="about-property/" element={<AboutProperty />} />
        {/* <Route path="buyer/" element={<Buyer />} /> */}
        {/* <Route path="loaction/" element={<LoactionPage />} /> */}
        <Route path="budget/" element={<Budget />} />
        <Route path="requirment/" element={<Requirment />} />
        <Route path="buyer-data/" element={<BuyerTwo />} />
        <Route path="landing/" element={<LandingPage />} />
        <Route path="success/" element={<Sucess />} />
        <Route path="Property/" element={<Property />} />
        {/* <Route path="agent/" element={<Agent />} /> */}
        <Route path="property-type/:our_services" element={<Residential />} />
        <Route path="search" element={<Search />} />
        <Route path="for-rent/" element={<Rent />} />
        <Route path="rentdetails/:id" element={<RentDetails />} />
        <Route path="disclaimer" element={<Disclaimer />} />
        <Route path="*" element={<NotFound />} />
        <Route path="sell-with-us" element={<SellWithUsModal />} />
        <Route path="forget-password" element={<ForgetPassword />} />
        <Route path="home-loan" element={<HomeLoan></HomeLoan>}/>
        <Route path="wishlist" element={<WishlistPage/>}/>
        <Route path="dashboards" element={<Dashboards/>}/>
        <Route path="requestProperties" element={<RequestProperties/>}/>
      </Routes>
    </BrowserRouter>
  );
}
