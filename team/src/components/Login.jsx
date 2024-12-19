import React, { useEffect, useState } from 'react'
import { validateEmail, validatePassword } from '../utilities/validation'
import { Link } from 'react-router-dom'
import { loginApi } from '../apis/login'
import { useNavigate } from 'react-router-dom'
import { useCookies } from 'react-cookie'

const initialErrorsState = {
    email: '',
    password: '',
    api: ''
}



function Login() {
    const [cookies, setCookie] = useCookies(['jwt']);
    const navigate = useNavigate()

    useEffect(() => {

        if(cookies.jwt){
            navigate('/')
        }
    })
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState(initialErrorsState)

    const handleEmailChange = (e) => {
        setEmail(e.target.value)
    }

    const handlePasswordChange = (e) => {
        setPassword(e.target.value)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        let newErrors ={}

        console.log("email:"  ,email)
        console.log("password:", password)
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
        const [response,error] = await loginApi({
            user: {
                email: email,
                password: password
            }
        })
       
        if(error !== ''){
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
    <div className="bg-white min-h-screen flex items-center justify-center">
  <div className="w-full max-w-md bg-white rounded-lg p-8">
    <div className="text-center mb-8">
      <h1 className="text-3xl  text-black-600 font-roboto">Team Tracker</h1>
    </div>

    <div className="text-center mb-6">
      <h3 className="text-xl text-gray-700 font-roboto">Sign In</h3>
    </div>

    {errors.api && (
      <div className="text-center mb-4 text-red-500 text-sm">
        {errors.api}
      </div>
    )}

    <form onSubmit={handleSubmit} className="space-y-6 border p-4 rounded">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email Address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Enter email"
          value={email}
          onChange={handleEmailChange}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-500">{errors.email}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Enter password"
          value={password}
          onChange={handlePasswordChange}
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-500">{errors.password}</p>
        )}
      </div>

      {/* Forgot Password Link
      <div className="flex justify-between items-center">
        <span></span>
        <Link to="/users/password/new" className="text-sm text-indigo-500 hover:underline">
          Forgot password?
        </Link>
      </div> */}

      {/* Submit Button */}
      <div>
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Sign In
        </button>
      </div>
    </form>

    <div className="text-center mt-6 border rounded p-4">
      <p className="text-sm text-gray-700">
        New to Team Tracker?{' '}
        <Link to="/register" className="text-indigo-500 hover:underline">
          Create an account
        </Link>
      </p>
    </div>

    <div className="text-center mt-8">
      <div className="space-x-4 text-sm text-gray-500">
        <Link to="" className="hover:underline">Terms</Link>
        <Link to="" className="hover:underline">Privacy</Link>
        <Link to="" className="hover:underline">Security</Link>
        <Link to="" className="hover:underline">Contact</Link>
      </div>
    </div>
  </div>
</div>

  )
}

export default Login