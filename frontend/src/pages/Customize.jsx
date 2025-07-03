import React, { useContext, useRef} from 'react'
import Card from "../components/Card"
import image1 from "../assets/image1.png"
import image2 from "../assets/image2.jpg"
import image3 from "../assets/image4.png"
import image4 from "../assets/authBg.png"
import image5 from "../assets/image5.png"
import image6 from "../assets/image6.jpeg"
import image7 from "../assets/image7.jpeg"
import { RiImageAddLine } from "react-icons/ri";
import { UserDataContext } from '../context/UserDataContext'
import { useNavigate } from 'react-router-dom'
import { IoArrowBack } from "react-icons/io5";

function Customize() {
    const { frontendImage,setFrontendImage, setBackendImage, selectedImage,setSelectedImage } = useContext(UserDataContext)
    const inputImage = useRef()
    const navigate = useNavigate()

    const handleImage = (e)=>{
        const file = e.target.files[0]
        setBackendImage(file)
        setFrontendImage(URL.createObjectURL(file))
    }
  return (
    <div className='w-full h-[100vh] bg-gradient-to-t from-[black] to-[#22226a] flex justify-center items-center flex-col relative'>

        <IoArrowBack className='absolute top-[30px] left-[30px] text-white  cursor-pointer w-[25px] h-[25px]' onClick={()=>navigate("/")}/>

        <h1 className='text-white text-[30px] text-center p-[20px] gap-[20px] mb-[30px]'>Select your <span className='text-blue-300'>Assistant Image</span></h1>
        <div className='w-[full] max-w-[60%] items-center justify-center flex-wrap flex gap-[15px]'> 
            <Card image={image1}/>
            <Card image={image2}/>
            <Card image={image3}/>
            <Card image={image4}/>
            <Card image={image5}/>
            <Card image={image6}/>
            <Card image={image7}/>

            <div
  className={`w-[70px] h-[140px] lg:w-[150px] lg:h-[250px] bg-[#161660] border-2-blue rounded-2xl overflow-hidden hover:shadow-2xl hover:inset-shadow-blue-950 cursor-pointer hover:border-4 hover:border-white flex justify-center items-center ${selectedImage === "input" ? "shadow-2xl inset-shadow-blue-950 border-4 border-white" : null}`}
  onClick={() => {
    inputImage.current.click();
    setSelectedImage("input");
  }}
>

     {! frontendImage && <RiImageAddLine className='text-white w-[25px] h-[20px] '/>}
     {frontendImage && <img src={frontendImage} className='h-full object-cover'/> }
     
    </div>
<input type='file' accept='image/*'  ref={inputImage} hidden onChange={handleImage}/>
        </div>
        
{selectedImage && <button className='min-w-[150px] h-[60px] mt-[30px] bg-white rounded-full text-black font-semibold text-[19px] cursor-pointer' onClick={()=>navigate("/customize2")}>Next</button>}
    </div>
  )
}

export default Customize