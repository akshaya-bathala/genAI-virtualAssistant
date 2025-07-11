import React, { useEffect, useState } from 'react'
import { UserDataContext } from './UserDataContext'
import axios from "axios"

function UserContext({ children }) {
    const serverUrl = "https://virtualassistant-backend-p0ua.onrender.com"
    const [userData, setUserData] = useState(null)
    const [frontendImage,setFrontendImage] =useState(null)
    const [backendImage,setBackendImage] =useState(null)
    const [selectedImage,setSelectedImage] = useState(null)

    const handleCurrentUser = async ()=>{
        try {
            const result = await axios.get(`${serverUrl}/api/user/current`,{withCredentials:true})
            setUserData(result.data)
            console.log(result.data)
        } catch (error) {
            console.log(error)
        }
    }


    const getGeminiResponse = async (command)=>{
        try {
            const result = await axios.post(`${serverUrl}/api/user/asktoassistant`,{command},{
                withCredentials:true
            })
            return result.data
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
      handleCurrentUser()
    }, [])
    

    const value = { serverUrl,userData, setUserData, frontendImage,setFrontendImage, backendImage,setBackendImage, selectedImage,setSelectedImage,getGeminiResponse }

    return (
        <UserDataContext.Provider value={value}>
            {children}
        </UserDataContext.Provider>
    )
}

export default UserContext
