import React, { useState } from 'react';
import Navbar from '../common/component/navbar';
import OurServices from '../common/component/ourServices';
import Searching from '../common/component/searching';
import BannerImage from '../Images/project-banner-image.jpg';
import BottomBar from '../common/component/bottomBar';
import AnimatedText from "../common/component/HeadingAnimation";
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import "../Css/EMICalculator.css";

const EMICalculator = () => {
  const [loanAmount, setLoanAmount] = useState(1000000);
  const [tenure, setTenure] = useState(10);
  const [interestRate, setInterestRate] = useState(7.0);
  const [showForm, setShowForm] = useState(false); // State to control the form visibility
  const [submittedData, setSubmittedData] = useState(null); // Store form submission data

  // Dynamic background calculation for sliders
  const getRangeBackground = (value, min, max) => {
    const percentage = ((value - min) / (max - min)) * 100;
    return `linear-gradient(to right, rgb(0, 75, 142) ${percentage}%, rgb(242, 242, 240) ${percentage}%)`;
  };


  const calculateEMI = () => {
    const r = interestRate / 100 / 12;
    const n = tenure * 12;
    const emi = (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    return emi.toFixed(2);
  };

  const totalPayment = (calculateEMI() * tenure * 12).toFixed(2);
  const interestAmount = (totalPayment - loanAmount).toFixed(2);

  const pieData = {
    labels: ['Principal Amount', 'Interest Amount'],
    datasets: [
      {
        data: [loanAmount, interestAmount],
        backgroundColor: ['#166534', '#a12129'],
        hoverBackgroundColor: ['#0e4524', '#751517']
      }
    ]
  };

  // Handle form submission
  const handleFormSubmit = (e) => {
    e.preventDefault();
    const userData = {
      name: e.target.name.value,
      email: e.target.email.value,
      loanAmount,
      interestAmount,
      totalPayment,
    };
    setSubmittedData(userData);
    console.log('Form Data Submitted:', submittedData);
    setShowForm(false);
    alert('Form submitted successfully!');
  };

  return (
    <>
      <Navbar />
      <div className="banner" style={{ backgroundImage: `url(${BannerImage})` }}>
        <h1 className="banner-title">
          <AnimatedText text="Home Loan EMI Calculator" />
        </h1>
      </div>
      <div className='container'>
        <div className="calculator-wrapper ">
          <div className="calculator-container">
            <div className="slider-container">
              {/* Loan Amount Slider */}
              <div className="calculator-inp-wrap">
                <div className="lable-div">
                  <label className="label">Loan Amount:</label>
                  <div className="num-inp-wrap">
                    <span className="input-prefix">₹</span>
                    <input className="input-number" type="number" value={loanAmount} onChange={(e) => setLoanAmount(Number(e.target.value))} min="100000" max="100000000"/>
                  </div>
                </div>
                <input className="input-range" type="range" min="100000" max="100000000" step="100000" value={loanAmount} onChange={(e) => setLoanAmount(Number(e.target.value))}
                  style={{
                    background: getRangeBackground(loanAmount, 100000, 100000000),
                  }}
                />
                <div className="min-max-wrap">
                  <span className="min-inp-amt">₹1 Lac</span>
                  <span className="max-inp-amt">₹10 Cr</span>
                </div>
              </div>

              {/* Tenure Slider */}
              <div className="calculator-inp-wrap">
                <div className="lable-div">
                  <label className="label">Tenure (Years):</label>
                  <div className="num-inp-wrap">
                    <input className="input-number" type="number" value={tenure} onChange={(e) => setTenure(Number(e.target.value))} min="1" max="30"/>
                  </div>
                </div>
                <input className="input-range" type="range" min="1" max="30" value={tenure}
                  onChange={(e) => setTenure(Number(e.target.value))}
                  style={{
                    background: getRangeBackground(tenure, 1, 30),
                  }}/>
                <div className="min-max-wrap">
                  <span className="min-inp-amt">1</span>
                  <span className="max-inp-amt">30</span>
                </div>
              </div>

              {/* Interest Rate Slider */}
              <div className="calculator-inp-wrap">
                <div className="lable-div">
                  <label className="label">Interest Rate (% P.A.):</label>
                  <div className="num-inp-wrap">
                    <input className="input-number" type="number" value={interestRate} onChange={(e) => setInterestRate(Number(e.target.value))} min="0.5" max="15" step="0.1"/>
                    <span className="input-prefix">%</span>
                  </div>
                </div>
                <input className="input-range" type="range" min="0.5" max="15" step="0.1" value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  style={{
                    background: getRangeBackground(interestRate, 0.5, 15),
                  }}/>
                <div className="min-max-wrap">
                  <span className="min-inp-amt">0.5%</span>
                  <span className="max-inp-amt">15%</span>
                </div>
              </div>
            </div>
          </div>
          <div className="chart-container">
            <div className='chart-main'>
              <div className='left inner'>
                <h2 className='chart-heading'>Monthly Loan EMI: </h2>
                <span className='main-price'>₹{calculateEMI()}</span>
                <li className='price-divider'></li>
                <div className='all-price'>                  
                  <div className="details-container">
                    <p className='loan-amount-heading'>Principal Amount: </p>
                    <span className='loan-amount'>₹{loanAmount.toLocaleString()}</span>
                    <p className='loan-amount-heading'>Interest Amount: </p>
                    <span className='loan-amount'>₹{Number(interestAmount).toLocaleString()}</span>
                    <p className='loan-amount-heading'>Total Amount Payable: </p>
                    <span className='loan-amount'>₹{Number(totalPayment).toLocaleString()}</span>
                  </div>
                </div>
                {/* Apply Now button to show form */}
                <button className="apply-now" onClick={() => setShowForm(true)}>Apply Now</button>
              </div>
              <div className='right inner'>
                <h2 className='chart-heading'>Loan Breakdown</h2>
                <Pie data={pieData} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Popup Form */}
      {showForm && (
        <div className="popup-form">
          <div className="form-container-loan">
            <button className="close-button" onClick={() => setShowForm(false)}>X</button>
            <h2 className='chart-heading'>Loan Application</h2>
            <form className="load-form" onSubmit={handleFormSubmit}>
              <div>
                <label>Name:</label>
                <input type="text" name="name" placeholder="Your Name" required />
              </div>
              <div>
                <label>Email:</label>
                <input type="email" name="email" placeholder="Your Email" required />
              </div>
              <div>
                <label>Principal Amount: ₹{loanAmount.toLocaleString()}</label>
              </div>
              <div>
                <label>Interest Amount: ₹{Number(interestAmount).toLocaleString()}</label>
              </div>
              <div>
                <label>Total Amount Payable: ₹{Number(totalPayment).toLocaleString()}</label>
              </div>

              <button type="submit">Submit</button>
            </form>
          </div>
        </div>
      )}

      <OurServices />
      <Searching />
      <BottomBar />
    </>
  );
}

export default EMICalculator;
