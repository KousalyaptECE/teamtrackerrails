import React, { useEffect, useState } from 'react';
import { validateEmail, validatePassword } from '../utilities/validation'
import { Link } from 'react-router-dom'
import { registerApi } from '../apis/register'
import { useNavigate } from 'react-router-dom'
import { useCookies } from 'react-cookie'

const initialErrorsState = {
    email: '',
    password: '',
    api: ''
}

const Register = () => {
    const [cookies, setCookie] = useCookies(['jwt']);
    const navigate = useNavigate()

    useEffect(() => {

        if(cookies.jwt){
            navigate('/')
        }
    })

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passconf, setPassconf] = useState('')
    const [errors, setErrors] = useState(initialErrorsState)

    const handleNameChange = (e) => {
        setName(e.target.value)
    }

    const handleEmailChange = (e) => {
        setEmail(e.target.value)
    }

    const handlePasswordChange = (e) => {
        setPassword(e.target.value)
    }

    const handlePassconfChange = (e) => {
        setPassconf(e.target.value)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        let newErrors ={}
        console.log("name:",name)
        console.log("email:"  ,email)
        console.log("password:", password)
        console.log("passconf:",passconf)
        

        if (!validateEmail(email)){
            newErrors = {
                ...newErrors,
                email: 'Invalid email'
            }
        }
        if(!validatePassword(password)){
            newErrors = {
                ...newErrors,
                password: 'Password should be atleast 6 characters long'
            }
        }
        setErrors(newErrors)

        const hasErrors = Object.values(newErrors).some(error => error !== '');
        if (hasErrors){
            return
        }
        const [response,error] = await registerApi({
            user: {
                name: name,
                email: email,
                password: password,
                password_confirmation: passconf
            }
        })
        // console.log("result:",result)
        // console.log("error:",error)
        if(error!== '' ){
            setErrors({
                ...error,
                api: error
            })
            
        }else{
            const jwt = response.headers.get('authorization')
            const result = await response.json(); 
            //const message = result.message;
            //const user = result.data;

            // console.log("message: ",message)
            // console.log("user: ",user)

            setCookie('jwt', jwt)
            //console.log("cookies: ", cookies.jwt)
            navigate('/')
        }
    }
  return (
    <div className="bg-white">
        <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 flex ">
            <div className="max-w-5xl mx-auto bg-white-100 p-4 rounded-lg">
                <h1 className="text-3xl font-roboto  mb-4">Join Team Tracker</h1>
                <p className=" text-gray-600 mb-8">
                The best way to design, build, and ship software.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-gray-700 font-medium">User Name</label>
                    <input
                    name="name"
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={handleNameChange}
                    className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                </div>

                <div>
                    <label className="block text-gray-700 font-medium">Email Address</label>
                    <input
                    name="email"
                    type="email"
                    placeholder="Your email id"
                    value={email}
                    onChange={handleEmailChange}
                    className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                    You will occasionally receive account-related emails. We promise not to share your email with anyone.
                    </p>
                </div>

                <div>
                    <label className="block text-gray-700 font-medium">Password</label>
                    <input
                    name="password"
                    type="password"
                    placeholder="******"
                    value={password}
                    onChange={handlePasswordChange}
                    className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                </div>

                <div>
                <label className="block text-gray-700 font-medium">Password Confirmation</label>
                <input
                    name="passconf"
                    type="password"
                    placeholder="******"
                    value={passconf}
                    onChange={handlePassconfChange}
                    className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
                </div>

                <div>
                <button
                    type="submit"
                    className="bg-green-500 hover:bg-indigo-600 text-white py-2 px-6 rounded">
                    Create an Account
                </button>
                </div>
                </form>

                <p className=" mt-6 text-gray-600">
                Already have an account?{" "}
                <Link to="/login" className="text-indigo-500 hover:underline">
                Log in
                </Link>
                </p>
            </div>

            <div className="mt-12 p-6 rounded-lg">
                <div className='border p-4 bg-gray-100' >
                <h2 className="text-xl font-bold mb-4">You'll Love Team Tracker</h2>
                <ul className="space-y-2 ">
                    <li>✅ Unlimited collaborators</li>
                    <li>✅ Unlimited public repositories</li>
                    <li>✅ Great communication</li>
                    <li>✅ Frictionless development</li>
                    <li>✅ Open-source community</li>
                </ul>
                </div>
            </div>
        </div>
    </div>

  )
};

export default Register;
