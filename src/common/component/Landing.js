
import BuyerTwo from "./buyerTwo";
import { Helmet } from "react-helmet";

export default function Landing() {
  return (
    <div className="">
      <Helmet>
        <title className="capitalize">
          Guru Home Solutions - Best Properties Mohali
        </title>
        <meta name="returant" content="resturant" />
      </Helmet>
      <BuyerTwo />
    </div>
  );
}
