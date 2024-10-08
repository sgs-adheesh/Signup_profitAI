import React, { useContext, useState, useEffect } from 'react'
import Input from 'react-phone-number-input/input';
import { DataContext, SignupForm } from '../context/SignupContext';
import 'react-phone-number-input/style.css'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'



const Signup: React.FC = () => {

    /* 
         tele is to store phone number, because while using the 'react-phone-number-input' package
         not able to store in formdata.phone , so storing into tele then stroing into formdata before submit   
     */
    const [tele, setTele] = useState<string | undefined>('')
    const context = useContext(DataContext);
    if (!context) {
        throw new Error("Signup must be used within a DataProvider");
    }
    const {
        formData, setFormData,
        errors, setErrors,
        message, setMessage,
        tenantMessage, setTenantMessage,
        navigate,
        logo, handIcon,
        axios, API_URL,
        reCaptcheError, setReCaptcheError
    } = context

    //for reCaptcha v3
    const { executeRecaptcha } = useGoogleReCaptcha();

    //const [token, setToken] = useState<string | null>(null);


    //for reflecting the tele value changes into formData
    useEffect(() => {
        setFormData({ ...formData, phone: tele })

    }, [tele, setTele])


    //for validating all the input formats while submit
    const validate = (): boolean => {

        const newErrors: Partial<Record<keyof SignupForm, string>> = {};
        const phonePattern = /^[0-9]*$/;
        const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

        if (!formData.firstname) newErrors.firstname = 'First name is required';
        if (!/^[A-Za-z\s]+$/.test(formData.firstname) && formData.firstname) newErrors.firstname = 'Invalid first name';
        if (formData.firstname.length < 3 && formData.firstname) newErrors.firstname = 'First name should contain more than 3 letter';
        if (!formData.secondname) newErrors.secondname = 'Second name is required';
        if (!/^[A-Za-z\s]+$/.test(formData.secondname) && formData.secondname) newErrors.secondname = 'Invalid second name';
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!emailPattern.test(formData.email)) {
            newErrors.email = 'Email format is invalid';
        }
        if (!formData.phone) {
            newErrors.phone = 'Phone number is required';
        }
        else if (!/^\+1(?!.*0{10})([2-9]\d{9})$/.test(formData.phone)) {
            newErrors.phone = 'Phone number must be in standard format';
        }
        else {
            const numericPhone = formData.phone.trim().slice(1);
            if (numericPhone.charAt(0) === '1') {
                if (!(numericPhone.length === 11)) {
                    newErrors.phone = 'Phone number must contain 10 digits';
                }
            }
            if (!phonePattern.test(numericPhone.trim().slice(-10))) {
                console.log(numericPhone.trim().slice(-10))
                newErrors.phone = 'Phone number must be numeric';
            }
        }
        if (!formData.restaurantname) newErrors.restaurantname = 'Restaurant name is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    //validation on switching the field / tab
    const validateField = (fieldName: keyof SignupForm): boolean => {

        const newErrors: Partial<Record<keyof SignupForm, string>> = {};
        const phonePattern = /^\+1\d{10}$/; // E.164 format for US numbers
        const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

        switch (fieldName) {
            case 'firstname':
                if (!formData.firstname) newErrors.firstname = 'First name is required';
                else if (!/^[A-Za-z\s]+$/.test(formData.firstname)) {
                    newErrors.firstname = 'Invalid first name';
                }
                else if (formData.firstname.length < 3) {
                    newErrors.firstname = 'First name should contain more than 3 letter';
                }
                else {
                    newErrors.firstname = ''
                }
                break;
            case 'secondname':
                if (!formData.secondname) newErrors.secondname = 'Second name is required';
                else if (!/^[A-Za-z\s]+$/.test(formData.secondname)) {
                    newErrors.secondname = 'Invalid second name';
                }
                else {
                    newErrors.secondname = ''
                }
                break;
            case 'email':
                if (!formData.email) {
                    newErrors.email = 'Email is required';
                } else if (!emailPattern.test(formData.email)) {
                    newErrors.email = 'Email format is invalid';
                }
                else {
                    newErrors.email = ''
                }
                break;
            case 'phone':
                if (!formData.phone) {
                    newErrors.phone = 'Phone number is required';
                } else if (!phonePattern.test(formData.phone)) {
                    newErrors.phone = 'Phone number must be in the format (555) 555-1234';
                }
                else if (!/^\+1(?!.*0{10})([2-9]\d{9})$/.test(formData.phone)) {
                    newErrors.phone = 'Phone number must be in standard format';
                }
                else {
                    newErrors.phone = ''
                }
                break;
            case 'restaurantname':
                if (!formData.restaurantname) newErrors.restaurantname = 'Restaurant name is required';

                else {
                    newErrors.restaurantname = ''
                }
                break;
            default:
                break;
        }
        setErrors((prevErrors) => ({ ...prevErrors, ...newErrors }));
        return Object.keys(newErrors).length === 0;
    };


    //for handling discount, to check whether the discount code is valid or not
    const handleDiscount = async () => {
        if (!formData.discount) {
            setMessage('');
            return;
        }

        try {
            const response = await axios.post(`${API_URL}/test/apply`, {
                discountCode: formData.discount
            });


            if (response.data.message == true) {
                setMessage(true)
            }
            else if (response.data.message == false) {
                setMessage(false)
            }
            else {
                setMessage('')
            }

        } catch (error) {
            console.error('Error applying discount:', error);
            setMessage("Something went wrong")
        }
    }
    const handleTenant = async () => {
        if (errors.restaurantname || formData.restaurantname === '') {
            setTenantMessage('')
            return;
        }

        try {
            const response = await axios.post(`${API_URL}/test/check`, {
                name: formData.restaurantname
            });
            //const data=true;

            if (response.data.message === false) {
                setTenantMessage(false)
            }
            else if (response.data.message === true) {
                setTenantMessage(true)
            }
            else {
                setTenantMessage('')
            }

        } catch (error) {
            console.error('Error applying name', error);
            setTenantMessage('Something went wrong')

        }
    }

    //form submission, it redirect to the payment page
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formattedPhone = tele ? tele.replace(/^\+1/, '') : '';
        setFormData({ ...formData, phone: formattedPhone });
        if (validate()) {
            console.log(formData)
            if (executeRecaptcha) {
                const token = await executeRecaptcha('signup_form');
                console.log(token)
                // const reqData = {...formData,recaptchaToke:token}
                if (!token) {
                    setReCaptcheError('reCAPTCHA validation failed')
                    return;
                }
                try {
                    // const response = await axios.post(`${API_URL}/signup`, reqData);
                    // console.log('Success:', response.data);
                    navigate('/signup/payment')
                    // if(response.data){
                    //     navigate('/signup/payment')
                    // }
                    // else{
                    //     setReCaptcheError('reCAPTCHA response failed')
                    // }
                }
                catch (error) {
                    console.error('Error:', error);
                }
            }
            else {
                console.error('ExecuteRecaptcha not available');
            }



        }
    }



    return (
        <div className="bg-[url('img/login-bg.jpg')] bg-cover ">
            <section className="flex flex-col items-center w-full">
                <img src={logo} className="w-[200px] mt-[50px] mb-[50px]" alt="Profit AI Logo" />
                <div className="bg-white w-[450px] drop-shadow-xl rounded p-[45px]">
                    <p className="text-base text-left text-[#757575]">Welcome! <img className="inline-block mt-[-4px] ml-[2px]" src={handIcon} alt='hand_icon' /></p>
                    <p className="text-2xl font-bold text-left text-[#333] mt-[5px] mb-7">Sign up for your Profit AI</p>

                    <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6" action="#">
                        <div className="mb-4">
                            <label htmlFor="firstname" className="block mb-2 text-base text-left text-[#111928]">
                                First Name
                                <span className="text-[#ff3030]">*</span>
                            </label>
                            <input
                                type="text"
                                name="firstname"
                                id="firstname"
                                value={formData.firstname}
                                onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
                                onBlur={() => validateField('firstname')}
                                className=" border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500"
                                placeholder="Scout"
                            />
                            {errors.firstname && <span className="text-sm text-red-500 dark:text-gray-400">{errors.firstname}</span>}
                        </div>

                        <div className="mb-4 mt-0">
                            <label htmlFor="secondtname" className="block mb-2 text-base text-left text-[#111928]">
                                Second Name
                                <span className="text-[#ff3030]">*</span>
                            </label>
                            <input
                                type="text"
                                name="secondname"
                                id="secondname"
                                value={formData.secondname}
                                onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
                                onBlur={() => validateField('secondname')}
                                className="border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500"
                                placeholder="Lawrence "
                            />
                            {errors.secondname && <span className="text-sm text-red-500 dark:text-gray-400">{errors.secondname}</span>}
                        </div>

                        <div className="mb-4">
                            <label htmlFor="email" className="block mb-2 text-base text-left text-[#111928]">
                                Email
                                <span className="text-[#ff3030]">*</span>
                            </label>
                            <input
                                type="text"
                                name="email"
                                id="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
                                onBlur={() => validateField('email')}
                                className=" border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500"
                                placeholder="mail@website.com"
                            />
                            {errors.email && <span className="text-sm text-red-500 dark:text-gray-400">{errors.email}</span>}
                            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">This email will serve as your login username</p>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="phone" className="block mb-2 text-base text-left text-[#111928]">
                                Phone
                                <span className="text-[#ff3030]">*</span>
                            </label>
                            <Input
                                defaultCountry="US"
                                value={tele}
                                onChange={(string) => setTele(string)}
                                onBlur={() => validateField('phone')}
                                placeholder="(415) 555‑0132"
                                maxLength={14}
                                className="border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:focus:ring-blue-500"
                            />
                            {errors.phone && <span className="text-sm text-red-500 dark:text-gray-400">{errors.phone}</span>}
                        </div>

                        <div className="mb-4">
                            <label htmlFor="restaurantname" className="block mb-2 text-base text-left text-[#111928]">
                                Restaurant Name
                                <span className="text-[#ff3030]">*</span>
                            </label>
                            <input
                                type="text"
                                name="restaurantname"
                                id="restaurantname"
                                value={formData.restaurantname}
                                onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
                                onBlur={() => {
                                    validateField('restaurantname')
                                    handleTenant()
                                }}
                                className=" border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500"
                                placeholder="The Gourmet Grill"
                            />
                            {tenantMessage === false ?
                                <span className="text-sm text-red-500 dark:text-gray-400">
                                    Restaurant name already existing
                                </span>
                                : tenantMessage === true ?
                                    <span className="text-sm text-green-500 dark:text-gray-400">

                                    </span>
                                    :
                                    <span className="text-sm text-red-500 dark:text-gray-400">
                                        {tenantMessage}
                                    </span>
                            }
                            {errors.restaurantname && <span className="text-sm text-red-500 dark:text-gray-400">{errors.restaurantname}</span>}
                        </div>

                        <hr className="border-gray-200 w-full" />

                        <div className="mb-4">
                            <label htmlFor="discount" className="block mb-2 text-base text-left text-[#111928]">
                                Discount code
                            </label>
                            <div className="flex items-start w-full justify-between">
                                <input
                                    type="text"
                                    name="discount"
                                    id="discount"
                                    value={formData.discount}
                                    onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
                                    className="w-2/3 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-primary-600 focus:border-primary-600 block p-2.5 dark:focus:ring-blue-50 float-left	"
                                    placeholder="DXS34FGD"
                                />
                                <button type="button" onClick={handleDiscount} className="w-1/4 text-black bg-white hover:bg-blue-700 hover:text-white font-medium rounded-lg text-base px-5 py-2.5 text-center border border-blue-700">Apply</button>
                            </div>
                            {message === true ?
                                <span className="text-sm text-green-500 dark:text-gray-400">
                                    Discount code applied!
                                </span>
                                : message === false ?
                                    <span className="text-sm text-red-500 dark:text-gray-400">
                                        Invalid discount code. Please try again
                                    </span>
                                    : <span className="text-sm text-red-500 dark:text-gray-400">
                                        {message}
                                    </span>
                            }
                        </div>
                        <div>

                        </div>
                        {reCaptcheError && <span className="text-sm text-red-500 dark:text-gray-400">{reCaptcheError}</span>}

                        <button type="submit" className="w-full text-white bg-blue-500 hover:bg-blue-700 font-medium rounded-lg text-base px-5 py-3 text-center">Next</button>
                        <p className="text-sm text-center text-gray-600 mt-2">Up next, You`ll need to enter your payment details,
                            make sure your card is handy!
                        </p>
                        <hr className="border-gray-200 w-full" />
                        <p className="text-base text-gray-500 text-center">
                            Already have an account? <a href="#" className="font-medium text-[#111928] hover:underline hover:text-blue-700">Login here</a>
                        </p>

                    </form>
                </div>
                <p className="text-base text-left text-black my-8"><a className="cursor-pointer hover:text-blue-700 "> Terms and Conditions</a> | <a className="cursor-pointer hover:text-blue-700">Privacy Policy</a></p>
            </section>
        </div>

    )
}

export default Signup;