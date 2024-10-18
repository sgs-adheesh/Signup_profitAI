import React, { useContext, useEffect } from 'react'
import { DataContext, PaymentForm } from '../context/SignupContext';
import { Bounce, toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';





const Signup_Payment: React.FC = () => {

  useEffect(() => {
    if (!formData.restaurantname || !formData.phone || !formData.firstname||!formData.secondname||!formData.email) {
      navigate('/')
    }
  })

  const context = useContext(DataContext);
  if (!context) {
    throw new Error("YourComponent must be used within a DataProvider");
  }
  const {
    paymentDetails, setPaymentDetails,
    paymentError, setPaymentError,
    logo, handIcon, paymentIcon,
    formData,
    axios, API_URL,
    navigate
  } = context;

  //validation of each field after press tab/switch field
  const validateField = (fieldName: keyof PaymentForm): boolean => {

    const newErrors: Partial<Record<keyof PaymentForm, string>> = {};
    switch (fieldName) {
      case 'cardno':
        if (!paymentDetails.cardno) newErrors.cardno = 'card number is required';
        else if (!/^\d{4} \d{4} \d{4} \d{4}$/.test(paymentDetails.cardno)) {
          newErrors.cardno = "Card number must be 16 digits.";
        } else {
          newErrors.cardno = ''
        }
        break;
      case 'name':
        if (!paymentDetails.name) {
          newErrors.name = "Name on card is required.";
        }
        else if (!/^[A-Za-z\s]+$/.test(paymentDetails.name)) {
          newErrors.name = 'Invalid name';
        }
        else if (paymentDetails.name.length < 3) {
          newErrors.name = 'Name should contain atleast 3 letters';
        }
        else {
          newErrors.name = ''
        }
        break;
      case 'expiry':

        if (!paymentDetails.expiry) {
          newErrors.expiry = "Expiry date is required.";
        } else if (!/^(0?[1-9]|1[0-2])\/([0-9]{2}|[0-9]{4})$/.test(paymentDetails.expiry)) {
          newErrors.expiry = "Month range should be in 01 to 12";
        }
        else if (!isValidFutureDate(paymentDetails.expiry)) {
          newErrors.expiry = "Please enter a future date"
        }
        else {
          newErrors.expiry = ''
        }
        break;
      case 'cvv':
        if (!paymentDetails.cvv) {
          newErrors.cvv = "CVV is required.";
        } else if (!/^\d{3}$/.test(paymentDetails.cvv.toString())) {
          newErrors.cvv = "CVV must be 3 digits.";
        } else if (!/^(?!000)\d{3}$/.test(paymentDetails.cvv.toString())) {
          newErrors.cvv = "Invalid CVV"
        }
        else {
          newErrors.cvv = ''
        }
        break;
      case 'business_name':
        if (!paymentDetails.business_name) {
          newErrors.business_name = "Business name is required.";
        }
        else if (!/^[a-z]|\d?[a-zA-Z0-9]?[a-zA-Z0-9\s&@.,'"]+$/.test(paymentDetails.business_name)) {
          newErrors.business_name = 'Invalid business name';
        } else if (paymentDetails.business_name.length < 3) {
          newErrors.business_name = 'Business name should contain atleast 3 letters';
        }
        else {
          newErrors.business_name = ''
        }
        break;
      case 'address1':
        if (!paymentDetails.address1) {
          newErrors.address1 = "Address line 1 is required.";
        }
        else {
          newErrors.address1 = ''
        }
        break;
      case 'city':
        if (!paymentDetails.city) {
          newErrors.city = "City is required.";
        }
        else {
          newErrors.city = ''
        }
        break;
      case 'state':
        if (!paymentDetails.state || paymentDetails.state === 'Select State') {
          newErrors.state = "State is required.";
        }
        else {
          newErrors.state = ''
        }
        break;
      case 'zip':
        if (!paymentDetails.zip) {
          newErrors.zip = "Zip code is required.";
        } else if (!/^(?!0{5})(?!.*-0{4})(\d{5}(-\d{4})?)$/.test(paymentDetails.zip.toString())) {
          newErrors.zip = "Zip code format is 12345 or 12345-6789";
        }
        else {
          newErrors.zip = ''
        }
        break;
      default:
        break;
    }

    setPaymentError((prevErrors) => ({ ...prevErrors, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };



  //form validation while submit
  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof PaymentForm, string>> = {};

    if (!paymentDetails.cardno) {
      newErrors.cardno = "Card number is required.";
    }
    if (!/^\d{4} \d{4} \d{4} \d{4}$/.test(paymentDetails.cardno)) {
      newErrors.cardno = "Card number must be 16 digits.";
    }

    if (!paymentDetails.name) {
      newErrors.name = "Name on card is required.";
    }
    if (!/^[A-Za-z\s]+$/.test(paymentDetails.name)) {
      newErrors.name = 'Invalid name';
    }
    if (paymentDetails.name.length < 3) {
      newErrors.name = 'Name should contain atleast 3 letters';
    }

    if (!paymentDetails.expiry) {
      newErrors.expiry = "Expiry date is required.";
    }
    if (!/^(0?[1-9]|1[0-2])\/([0-9]{2}|[0-9]{4})$/.test(paymentDetails.expiry)) {
      newErrors.expiry = "Month range should be in 01 to 12";
    }
    if (!isValidFutureDate(paymentDetails.expiry)) {
      newErrors.expiry = "Please enter a future date"
    }

    if (!paymentDetails.cvv) {
      newErrors.cvv = "CVV is required.";
    }
    if (!/^\d{3}$/.test(paymentDetails.cvv.toString())) {
      newErrors.cvv = "CVV must be 3 digits.";
    }
    if (!/^(?!000)\d{3}$/.test(paymentDetails.cvv.toString())) {
      newErrors.cvv = "Invalid CVV"
    }
    if (!paymentDetails.business_name) {
      newErrors.business_name = "Business name is required.";
    }
    if (!/^[a-z]|\d?[a-zA-Z0-9]?[a-zA-Z0-9\s&@.,'"]+$/.test(paymentDetails.business_name)) {
      newErrors.business_name = 'Invalid business name';
    }
    if (paymentDetails.business_name.length < 3) {
      newErrors.business_name = 'Business name should contain atleast 3 letters';
    }

    if (!paymentDetails.address1) {
      newErrors.address1 = "Address line 1 is required.";
    }

    if (!paymentDetails.city) {
      newErrors.city = "City is required.";
    }

    if (!paymentDetails.state || paymentDetails.state === 'Select State') {
      newErrors.state = "State is required.";
    }

    if (!paymentDetails.zip) {
      newErrors.zip = "Zip code is required.";
    }
    if (!/^(?!0{5})(?!.*-0{4})(\d{5}(-\d{4})?)$/.test(paymentDetails.zip.toString())) {
      newErrors.zip = "Zip code format is 12345 or 12345-6789";
    }


    setPaymentError(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  //for handling the submit
  const handlePaymentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (validate()) {
      console.log(paymentDetails)
      try {
        const response = await axios.post(`${API_URL}/test/tenants`, {
          name: formData.restaurantname,
          firstName:formData.firstname,
          secondName:formData.secondname,
          email:formData.email,
          phone: formData.phone,
          businessName: paymentDetails.business_name,
          addressLineOne: paymentDetails.address1,
          addressLineTwo: paymentDetails.address2,
          city: paymentDetails.city,
          state: paymentDetails.state,
          zipCode: paymentDetails.zip,
        });
        if (response.data.message === "Tenant added successfully") {
          toast.success("Details submitted successfully, You`ll receive a confirmation mail with login credentials", {
            position: "top-center",
            autoClose: 7000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Bounce,

          });
        }
        else if (response.data.message === "Failed to add tenant") {
          toast.warning("Already submitted , Check your mail for login credential", {
            position: "top-center",
            autoClose: 7000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Bounce,

          });
        }
      } catch (error) {
        console.error('Error posting tenant details', error);
        toast.error("Submission failed. Please try again.", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition:Bounce,
        });

      }

    }
  }

  //for handling the card number, ie, after 4 digit we have to give a space
  const handleInputChange = (evt: React.ChangeEvent<HTMLInputElement>) => {

    const { name, value } = evt.target;
    const strippedValue = value.replace(/\s+/g, '');
    let newVal = '';

    for (let i = 0; i < strippedValue.length; i++) {
      if (i > 0 && i % 4 === 0) {
        newVal += ' ';
      }
      newVal += strippedValue[i];
    }
    setPaymentDetails({ ...paymentDetails, [name]: newVal });
  }

  //focus on field
  const handleInputFocus = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentDetails({ ...paymentDetails, focus: evt.target.name })
  }

  //for date formatting
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const formattedValue = formatDate(value);
    setPaymentDetails({ ...paymentDetails, [e.target.name]: formattedValue })


    // Validate if the date is a future date
    if (isValidFutureDate(formattedValue)) {
      setPaymentError({ ...paymentError, expiry: "" })
    } else {
      setPaymentError({ ...paymentError, expiry: "Please enter a future date" })
    }
  };

  const formatDate = (value: string) => {
    const digits = value.replace(/\D/g, '');
    let formatted = '';


    if (digits.length <= 2) {
      formatted = digits;
    } else if (digits.length <= 3) {
      formatted = `${digits.slice(0, 1)}/${digits.slice(1)}`;
    } else if (digits.length <= 4) {
      formatted = `${digits.slice(0, 2)}/${digits.slice(2)}`;
    } else if (digits.length <= 5) {
      formatted = `${digits.slice(0, 1)}/${digits.slice(1)}`;
    } else if (digits.length <= 6) {
      formatted = `${digits.slice(0, 2)}/${digits.slice(2)}`;
    }
    else {
      formatted = `${digits.slice(0, 2)}/${digits.slice(2, 6)}`;
    }

    if (formatted === '00/0000') {
      formatted = ''
    }

    return formatted;
  };

  const isValidFutureDate = (value: string) => {

    const parts = value.split('/');
    if (parts.length < 2) return false;

    const month = parseInt(parts[0], 10);
    const year = parts[1].length === 2 ? 2000 + parseInt(parts[1], 10) : parseInt(parts[1], 10);


    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;


    if (year > currentYear || (year === currentYear && month > currentMonth)) {
      return true;
    }

    return false;
  };


  const normalizeDateFormat = (dateStr: string) => {
    const regex = /^(0?[1-9]|1[0-2])\/(\d{2}|\d{4})$/;
    const match = dateStr.match(regex);

    if (!match) {
      console.error("Invalid date format");
      return null;
    }

    const month = match[1].padStart(2, '0');
    let year: string;

    if (match[2].length === 2) {

      year = '20' + match[2];
    } else {
      year = match[2];
    }

    setPaymentDetails({ ...paymentDetails, expiry: `${month}/${year}` })



  };





  return (
    <div className="bg-[url('img/login-bg.jpg')] bg-cover ">
      <section className="flex flex-col items-center w-full">
        <img src={logo} className="w-[200px] mt-[50px] mb-[50px]" alt="Profit AI Logo" />
        <div className="bg-white w-[850px] drop-shadow-xl rounded p-[45px]"><p className="text-sm text-left text-[#757575]">Welcome! <img className="inline-block mt-[-4px] ml-[2px]" src={handIcon} alt='bg-white' /></p>
          <p className="text-2xl font-bold text-left text-[#333] mt-[5px] mb-6 float-left">Sign up for your Profit AI</p>
          <img src={paymentIcon} className="mb-4 float-right" alt='payment' />
          <div className="clear-both"></div>

          <form onSubmit={handlePaymentSubmit} className="space-y-4 md:space-y-6 w-full" action="#">
            <div className="w-[350px] float-left mt-6">
              <div className="mb-4">
                <label htmlFor="cardno" className="block mb-2 text-base text-left text-[#111928]">
                  Card Number
                  <span className="text-[#ff3030]">*</span>
                </label>

                <input
                  type="tel"
                  name="cardno"
                  id="cardno"
                  maxLength={19}
                  autoComplete="off"
                  spellCheck="false"
                  value={paymentDetails.cardno}
                  onChange={handleInputChange}
                  onBlur={() => {
                    validateField('cardno')
                    //setPaymentDetails({ ...paymentDetails, [e.target.name]: e.target.value.replace(/\D/g, '')})
                  }}
                  onFocus={handleInputFocus}
                  className=" border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                  placeholder="1234 4567 6789 9876"
                />
                {paymentError.cardno && <span className="text-sm text-red-500 dark:text-gray-400">{paymentError.cardno}</span>}
              </div>


              <div className="mb-4">
                <label htmlFor="name" className="block mb-2 text-base text-left text-[#111928]">
                  Name on Card
                  <span className="text-[#ff3030]">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={paymentDetails.name}
                  onChange={(e) => setPaymentDetails({ ...paymentDetails, [e.target.name]: e.target.value })}
                  onFocus={handleInputFocus}
                  onBlur={() => validateField('name')

                  }
                  className=" border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500"
                  placeholder="Scout Lawrence"
                />
                {paymentError.name && <span className="text-sm text-red-500 dark:text-gray-400">{paymentError.name}</span>}
              </div>


              <div className="mb-4">
                <label htmlFor="expiry" className="block mb-2 text-base text-left text-[#111928]">
                  Expiry Date
                  <span className="text-[#ff3030]">*</span>
                </label>
                <input
                  type="text"
                  name="expiry"
                  id="expiry"
                  value={paymentDetails.expiry}
                  onChange={(e) => {
                    handleDateChange(e)
                  }}
                  onFocus={handleInputFocus}
                  onBlur={(e) => {
                    validateField('expiry')
                    normalizeDateFormat(e.target.value)
                  }}
                  className=" border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500"
                  placeholder="MM/YYYY"
                />
                {paymentError.expiry && <span className="text-sm text-red-500 dark:text-gray-400">{paymentError.expiry}</span>}
              </div>


              <div className="mb-4 w-[50%]">
                <label htmlFor="cvv" className="block mb-2 text-base text-left text-[#111928]">
                  CVV
                  <span className="text-[#ff3030]">*</span>
                </label>

                <input
                  type="tel"
                  name="cvv"
                  id="cvv"
                  value={paymentDetails.cvv}
                  onChange={(e) => setPaymentDetails({ ...paymentDetails, [e.target.name]: e.target.value })}
                  onFocus={handleInputFocus}
                  onBlur={() => validateField('cvv')}
                  className=" border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500"
                  placeholder="123"
                  maxLength={3}
                />
                {paymentError.cvv && <span className="text-sm text-red-500 dark:text-gray-400">{paymentError.cvv}</span>}
              </div>


              <div className="w-full">
                <div className="flex items-center p-4 text-sm text-blue-800 rounded-lg bg-blue-50 w-full mt-6" role="alert">
                  <svg className="flex-shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                  </svg>
                  <span className="sr-only">Info</span>
                  <div>
                    If you entered a discount code in the previous screen, your payment will be adjusted accordingly.
                  </div>
                </div>
              </div>
            </div>
            <div></div>
            <div className="w-[350px] float-right">
              <div className="mb-4">
                <label htmlFor="business_name" className="block mb-2 text-base text-left text-[#111928]">
                  Business name
                  <span className="text-[#ff3030]">*</span>
                </label>
                <input
                  type="text"
                  name="business_name"
                  id="business_name"
                  value={paymentDetails.business_name}
                  onChange={(e) => setPaymentDetails({ ...paymentDetails, [e.target.name]: e.target.value })}
                  onBlur={() => validateField('business_name')}
                  className=" border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                  placeholder="Dice 'N Dine"
                />
                {paymentError.business_name && <span className="text-sm text-red-500 dark:text-gray-400">{paymentError.business_name}</span>}
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">This is the name you registered as your business.</p>
              </div>


              <div className="mb-4">
                <label htmlFor="address1" className="block mb-2 text-base text-left text-[#111928]">
                  Address line 1
                  <span className="text-[#ff3030]">*</span>
                </label>
                <input
                  type="text"
                  name="address1"
                  id="address1"
                  value={paymentDetails.address1}
                  onChange={(e) => setPaymentDetails({ ...paymentDetails, [e.target.name]: e.target.value })}
                  onBlur={() => validateField('address1')}
                  className=" border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500"
                  placeholder="3977 Taylor Street"
                />
                {paymentError.address1 && <span className="text-sm text-red-500 dark:text-gray-400">{paymentError.address1}</span>}

              </div>

              <div className="mb-4">
                <label htmlFor="address2" className="block mb-2 text-base text-left text-[#111928]">
                  Address line 2
                </label>
                <input
                  type="text"
                  name="address2"
                  id="address2"
                  value={paymentDetails.address2}
                  onChange={(e) => setPaymentDetails({ ...paymentDetails, [e.target.name]: e.target.value })}
                  className=" border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500"
                  placeholder="White Plains"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="city" className="block mb-2 text-base text-left text-[#111928]">
                  City
                  <span className="text-[#ff3030]">*</span>
                </label>
                <input
                  type="text"
                  name="city"
                  id="city"
                  value={paymentDetails.city}
                  onChange={(e) => setPaymentDetails({ ...paymentDetails, [e.target.name]: e.target.value })}
                  onBlur={() => validateField('city')}
                  className=" border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500"
                  placeholder="Newyork"
                />
                {paymentError.city && <span className="text-sm text-red-500 dark:text-gray-400">{paymentError.city}</span>}

              </div>

              <div className="mb-10">
                <div className=" mx-auto flex flex-row	">
                  <div className="w-[45%]">
                    <label htmlFor="email" className="block mb-2 text-base text-left text-[#111928] w-full">
                      State
                      <span className="text-[#ff3030]">*</span>
                    </label>
                    <select
                      id="state"
                      name="state"
                      className="bg-white border border-gray-300  border-white-900  text-gray-900 pr-[10px] text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      value={paymentDetails.state}
                      onChange={(e) => setPaymentDetails({ ...paymentDetails, [e.target.name]: e.target.value })}
                      onBlur={() => validateField('state')}
                    >
                      <option value='Select State' >Select State</option>
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="FR">France</option>
                      <option value="DE">Germany</option>


                    </select>
                    {paymentError.state && <span className="text-sm text-red-500 dark:text-gray-400">{paymentError.state}</span>}
                  </div>


                  <div className="w-[45%] ml-10">
                    <label htmlFor="zip" className="block mb-2 text-base text-left text-[#111928]">
                      Zipcode
                    </label>
                    <input
                      type="tel"
                      name="zip"
                      id="zip"
                      value={paymentDetails.zip}
                      onChange={(e) => setPaymentDetails({ ...paymentDetails, [e.target.name]: e.target.value })}
                      onBlur={() => validateField('zip')}
                      className=" border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                      placeholder="12345"
                      maxLength={10}

                    />
                    {paymentError.zip && <span className="text-sm text-red-500 dark:text-gray-400">{paymentError.zip}</span>}

                  </div>

                </div>
              </div>
            </div>
            <div className="clear-both"></div>
            <div>

            </div>
            <div className="border-t-[1px] border-gray-200 mt-10 pt-5">
              <div className=" float-left content-center justify-between w-full flex">
                <button type="submit" className="text-white bg-blue-500 hover:bg-blue-700 font-medium rounded-lg text-sm px-7 w-[200px] py-3 text-center float-left">Submit</button>
                <p className="text-sm text-center text-gray-600 mt-2 float-right">Up next, you`ll receive a confirmation mail
                  with login credentials !
                </p>
              </div>
            </div>
          </form>
        </div>

        <ToastContainer />
        <p className="text-sm text-left text-black my-8"><a className="cursor-pointer hover:text-blue-700 " href='#'> Terms and Conditions</a> | <a className="cursor-pointer hover:text-blue-700" href='#'>Privacy Policy</a></p>
      </section>
    </div>
  )
}

export default Signup_Payment;