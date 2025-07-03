import React, { useContext } from 'react'
import { UserDataContext } from '../context/UserDataContext'

function Card({image}) {
    const {serverUrl,userData, setUserData, frontendImage,setFrontendImage, backendImage,setBackendImage, selectedImage,setSelectedImage } = useContext(UserDataContext)
  return (
    <div className={`w-[70px] h-[140px] lg:w-[150px] lg:h-[250px] bg-[#161660] border-2-blue rounded-2xl overflow-hidden hover:shadow-2xl hover:inset-shadow-blue-950 cursor-pointer hover:border-4 hover:border-white ${selectedImage==image?"shadow-2xl inset-shadow-blue-950 border-4 border-white":null}` }onClick={()=>{setSelectedImage(image)
        setBackendImage(null)
        setFrontendImage(null)
    }}>
        <img src={image} className='h-full object-cover' />
    </div>
  )
}

export default Card