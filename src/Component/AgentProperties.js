import React, { useEffect, useState } from "react";
import '../Css/AgentPage.css';
import { useParams } from "react-router-dom";
import Navbar from "../common/component/navbar";
import BottomBar from "../common/component/bottomBar";
import { liveUrl, token } from "../common/component/url";
import Noimage from ".././assets/img/image-not.jpg";
import AnimatedText from "../common/component/HeadingAnimation";
import OurServices from "../common/component/ourServices";
import Searching from "../common/component/searching";

export default function AgentProperties() {
    const [agentData, setAgentData] = useState([]);
    const [loader, setLoader] = useState(true);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });

    // Function to handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        const apiUrl = "https://your-api-endpoint.com/contact";

        try {
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const result = await response.json();
                console.log("Form submitted successfully:", result);
                // You can add any success message or action here
            } else {
                console.error("Error submitting form:", response.statusText);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    // Getting Agent Data
    useEffect(() => {
        window.scrollTo(0, 0);
        fetch(`${liveUrl}agent-projects`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            }
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                setAgentData(data.result);
                setLoader(false);
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    }, []);

    console.log(agentData, 'klkaskldfklsdklfalksdlkfjasd ');

    return (
        <>
            <Navbar />
            <div className="lg:text-3xl font-bold mb-4 mt-4 text-2xl uppercase text-center text-green-800">
                <AnimatedText text="Agent Properties" />
            </div>
            {loader ? (
                <>
                    <div className="flex justify-center align-items-center p-2  ">
                        <svg
                            className=" animate-spin h-10 w-10 mt-4 mb-4 "
                            fill="#014108"
                            xmlns="http://www.w3.org/2000/svg"
                            height="1em"
                            viewBox="0 0 512 512"
                        >
                            <path d="M304 48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zm0 416a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM48 304a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm464-48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM142.9 437A48 48 0 1 0 75 369.1 48 48 0 1 0 142.9 437zm0-294.2A48 48 0 1 0 75 75a48 48 0 1 0 67.9 67.9zM369.1 437A48 48 0 1 0 437 369.1 48 48 0 1 0 369.1 437z" />
                        </svg>
                    </div>
                </>
            ) : <>
                <div className="container">
                    <div className="property-container">
                        {agentData.map((data, index) => (
                            <div key={index} className="property-card">
                                <div className="property-image-div">
                                    <a target="_blank" rel="noopener noreferrer">
                                        {
                                            (data.image_one || data.image_two || data.image_three || data.image_four) ? (
                                                <img
                                                    className="cursor-pointer h-64 w-full"
                                                    src={data.image_one || data.image_two || data.image_three || data.image_four}
                                                    alt="Panel 1"
                                                />
                                            ) : (
                                                <img
                                                    className="cursor-pointer h-64 w-full"
                                                    src={Noimage}
                                                    alt="No image available"
                                                />
                                            )
                                        }
                                    </a>
                                    <div className={`property-label ${data.property_for}`}>{data.property_for}</div>
                                </div>
                                <h3 className="property-name text-green-800 text-gr font-bold">{data.name}</h3>
                                <div class="proerty-addres flex mt-1"><svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" fill="#14532d"><path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"></path></svg><div class="ml-2 font-semibold text-sm">{data.address}</div></div>
                                <p className="property-price text-green-800 text-gr font-bold flex">
                                    {data.budget ? <>
                                        <svg
                                            fill="#14532d"
                                            className="w-5 h-5"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 320 512"
                                        >
                                            <path d="M0 64C0 46.3 14.3 32 32 32H96h16H288c17.7 0 32 14.3 32 32s-14.3 32-32 32H231.8c9.6 14.4 16.7 30.6 20.7 48H288c17.7 0 32 14.3 32 32s-14.3 32-32 32H252.4c-13.2 58.3-61.9 103.2-122.2 110.9L274.6 422c14.4 10.3 17.7 30.3 7.4 44.6s-30.3 17.7-44.6 7.4L13.4 314C2.1 306-2.7 291.5 1.5 278.2S18.1 256 32 256h80c32.8 0 61-19.7 73.3-48H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H185.3C173 115.7 144.8 96 112 96H96 32C14.3 96 0 81.7 0 64z" />
                                        </svg>
                                    </> : <></>}
                                    {data.budget}


                                </p>
                                <p className="property-type">{data.services}</p>
                                {/* <p className="property-description">{property.description}</p> */}
                                <div className="property-footer">
                                    <span>250sqft</span>
                                    {/* <span>{`${property.beds} Beds`}</span>
                                <span>{`${property.baths} Baths`}</span> */}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </>}

            <div className="contact-container">
                <div className="contact-info">
                    <h2>Get in touch with Our Agent</h2>
                    <p>Say hello</p>
                    <p>
                        Donec ullamcorper nulla non metus auctor fringilla. Curabitur blandit
                        tempus porttitor. Sed lectus urna, ultricies sit amet risus eget.
                    </p>
                    <div className="contact-details">
                        <p>
                            <strong>Address:</strong> 1481 Creekside Lane Avila Beach, CA 93424
                        </p>
                        <p>
                            <strong>Phone:</strong> +53 345 7953 32453
                        </p>
                        <p>
                            <strong>Email:</strong> yourmail@gmail.com
                        </p>
                    </div>
                </div>

                <form className="contact-form" onSubmit={handleSubmit}>
                    <div className="input-group">
                        <input
                            type="text"
                            placeholder="Name"
                            className="input"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                        />
                        <input
                            type="email"
                            placeholder="E-mail"
                            className="input"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <input
                        type="text"
                        placeholder="Subject"
                        className="input"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                    />
                    <textarea
                        placeholder="Message"
                        className="textarea"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                    ></textarea>
                    <button type="submit" className="submit-btn">
                        SEND
                    </button>
                </form>
            </div>
            <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d109744.05918264351!2d76.68814008460845!3d30.73240187493263!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390fed0be66ec96b%3A0xa5ff67f9527319fe!2sChandigarh!5e0!3m2!1sen!2sin!4v1728026418488!5m2!1sen!2sin"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
            <OurServices />
            <Searching />
            <BottomBar />
        </>
    );
}