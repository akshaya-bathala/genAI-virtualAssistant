import React, { useContext, useState } from 'react'
import { UserDataContext } from '../context/UserDataContext'
import axios from "axios"
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';


function Customize2() {
    const {userData, backendImage, selectedImage, serverUrl, setUserData} = useContext(UserDataContext)
    const [assistantName,setAssistantName] = useState(userData?.Assistantname || "")
    const [loading,setLoading] = useState(false)
    const navigate = useNavigate()

    const handleUpdateAssistant = async()=>{
      setLoading(true)
        try {
            const formData = new FormData()
            formData.append("assistantName",assistantName)
            if(backendImage){
                formData.append("assistantImage",backendImage)
            }else{
                formData.append("imageUrl",selectedImage)
            }
            const result = await axios.post(`${serverUrl}/api/user/update`,formData,{withCredentials:true})

            console.log(result.data)
            setUserData(result.data)
            setLoading(false)
            navigate("/")
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }


  return (
    <div className='w-full h-[100vh] bg-gradient-to-t from-[black] to-[#22226a] flex justify-center items-center flex-col p-[20px] relative'>

        <IoArrowBack className='absolute top-[30px] left-[30px] text-white  cursor-pointer w-[25px] h-[25px]' onClick={()=>navigate("/customize")}/>
        <h1 className='text-white text-[30px] text-center p-[20px] gap-[20px] mb-[30px]'>Enter Your <span className='text-blue-300'>Assistant Name</span></h1>
        
        <input
    type="text"
    placeholder='eg. shifra'
    className='w-full max-w-[600px] h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-[20px] py-[10px] rounded-full text-[18px]'
    required
    onChange={(e)=>setAssistantName(e.target.value)}
    value={assistantName}
 
    
  />
  {assistantName && <button className='min-w-[300px] h-[60px] mt-[30px] bg-white rounded-full text-black font-semibold text-[19px] cursor-pointer' disabled={loading} onClick={() => {
    handleUpdateAssistant()
 
  }}>
  {!loading?"Finally Create Your Assisstant":"Loading.."}</button>}

    </div>
  )
}

export default Customize2