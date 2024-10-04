import React, { createContext, useState, ReactNode } from 'react';
import { useNavigate,NavigateFunction} from 'react-router-dom';
import logo from '../img/logo-full.svg';
import handIcon from "../img/hand-icon.svg";
import paymentIcon from "../img/payment.svg"
import axios, { AxiosInstance } from 'axios';


export interface SignupForm {
    firstname: string;
    secondname: string;
    email: string;
    phone?: string;
    restaurantname: string;
    discount: string;
}
export interface PaymentForm {
    cardno:string;
    name:string;
    expiry:string;
    cvv:number;
    focus:string;
    business_name:string;
    address1:string;
    address2:string;
    city:string;
    state:string;
    zip:number;
}
interface DataContextType {
    formData: SignupForm;
    setFormData: React.Dispatch<React.SetStateAction<SignupForm>>;
    errors: Partial<Record<keyof SignupForm, string>>;
    setErrors: React.Dispatch<React.SetStateAction<Partial<Record<keyof SignupForm, string>>>>;
    message: boolean|string;
    setMessage: React.Dispatch<React.SetStateAction<boolean|string>>;
    navigate: NavigateFunction;
    paymentDetails:PaymentForm;
    setPaymentDetails:React.Dispatch<React.SetStateAction<PaymentForm>>;
    paymentError:Partial<Record<keyof PaymentForm, string>>;
    setPaymentError:React.Dispatch<React.SetStateAction<Partial<Record<keyof PaymentForm, string>>>>;
    logo: string;
    handIcon: string;
    paymentIcon: string;
    axios:AxiosInstance;
    API_URL:string;
    reCaptcheError:string;
    setReCaptcheError:React.Dispatch<React.SetStateAction<string>>;
    SITE_KEY:object;
    

}

export const DataContext = createContext<DataContextType | undefined>(undefined);


const site_key = '6LcpeVQqAAAAACczaEFPePOgStVqHCBzGzUy_OF8';

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [formData, setFormData] = useState<SignupForm>({
        firstname: '',
        secondname: '',
        email: '',
        phone: '',
        restaurantname: '',
        discount: '',
    });

    const [paymentDetails,setPaymentDetails] = useState<PaymentForm>({
        cardno:'',
        name:'',
        expiry:'',
        cvv:0,
        focus: '' as 'number' | 'expiry' | 'cvc' | 'name' | '',
        business_name:'',
        address1:'',
        address2:'',
        city:'',
        state:'',
        zip:0,
    })

    const [errors, setErrors] = useState<Partial<Record<keyof SignupForm, string>>>({});
    const [message, setMessage] = useState<boolean|string>(''); // For showing messages
    const [reCaptcheError,setReCaptcheError] = useState<string>('')
    const [paymentError,setPaymentError] = useState<Partial<Record<keyof PaymentForm, string>>>({});

    const navigate = useNavigate()

    const API_URL = 'base_URL'
    const SITE_KEY ={site_key}

    return (
        <DataContext.Provider value={{ 
            formData, setFormData, 
            errors, setErrors, 
            message, setMessage,
            navigate, 
            paymentDetails,setPaymentDetails,
            paymentError,setPaymentError,
            logo,handIcon,paymentIcon,
            axios,API_URL,
            reCaptcheError,setReCaptcheError,
            SITE_KEY
        }}>
            
            {children}
        </DataContext.Provider>
    );
};

export default DataContext