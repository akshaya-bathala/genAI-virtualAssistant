import React, { useContext, useState } from 'react'
import bg from "../assets/authBg.png"
import { useNavigate } from 'react-router-dom'
import { UserDataContext } from '../context/UserDataContext'
import axios from "axios"

function SignIn() {
    
    const navigate = useNavigate()
    
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const [loading,setLoading] = useState(false)

    const [err,setErr] = useState("")

    const {serverUrl,userData, setUserData} = useContext(UserDataContext)
    // api fetch for signup using axios and context api
    const handleSignIn = async (e)=>{
        e.preventDefault()
        setErr("")
        setLoading(true)
        try {
            let result = await axios.post(`${serverUrl}/api/auth/signin`,{
             email,password
            },{withCredentials:true})
            setUserData(result.data)
            setLoading(false)
            navigate("/")
        } catch (error) {
            console.log(error)
            setUserData(null)
            setErr(error.response.data.message)
            setLoading(false)
        }
    }

  return (

    <div className="w-full h-screen bg-cover flex justify-center items-center" style={{ backgroundImage:`url(${bg})`}}>
<form className='w-[90%] h-[600px] max-w-[500px] bg-[#0c000050] backdrop-blur shadow-lg shadow-blue-950 flex flex-col items-center justify-center gap-[20px] px-[20px]' onSubmit={handleSignIn}>

  <h1 className='text-white text-[30px] font-semibold mb-[30px]'>
    Sign In to <span className='text-blue-400'>Virtual Assistant</span>
  </h1>

  <input
    type="text"
    placeholder='Email'
    className='w-full h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-[20px] py-[10px] rounded-full text-[18px]'
    required
    onChange={(e) => setEmail(e.target.value)}
    value={email}
  />

  <input
    type="password"
    placeholder='Password'
    className='w-full h-[60px] rounded-full outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-[20px] py-[10px] text-[18px]'
    required
    onChange={(e) => setPassword(e.target.value)}
    value={password}
  />

  {err.length > 0 && (
    <p className='text-red-500 text-[17px]'>
      *{err}
    </p>
  )}

  <button
    className='min-w-[150px] h-[60px] mt-[30px] bg-white rounded-full text-black font-semibold text-[19px] cursor-pointer'
    disabled={loading}
  >
    {loading ? "Loading..." : "Sign In"}
  </button>

  <p
    className='text-white text-[18px] cursor-pointer'
    onClick={() => navigate("/signup")}
  >
    Want to create a new account? <span className='text-blue-400'>Sign Up</span>
  </p>
</form>

    </div>
  )
}

export default SignIn