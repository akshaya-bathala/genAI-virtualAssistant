import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserDataContext } from '../context/UserDataContext';

function Home() {
  const { userData, serverUrl, setUserData, getGeminiResponse } = useContext(UserDataContext);
  const navigate = useNavigate();
  const [listening, setListening] = useState(false);
  const isSpeakingRef = useRef(false);
  const recognitionRef = useRef(null);
  const isRecognizingRef = useRef(false);
  const synth = window.speechSynthesis;

  const handleLogOut = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true });
      setUserData(null);
      navigate('/signin');
    } catch (error) {
      console.log(error);
    }
  };

  const startRecognition = () => {
    try {
      recognitionRef.current?.start();
      setListening(true);
    } catch (error) {
      if (!error.message.includes('start')) {
        console.error('Recognition error:', error);
      }
    }
  };

  const speak = (text, lang = 'en-US') => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;

    let voices = window.speechSynthesis.getVoices();
    if (!voices.length) {
      window.speechSynthesis.onvoiceschanged = () => {
        voices = window.speechSynthesis.getVoices();
      };
    }

    const selectedVoice = voices.find((voice) => voice.lang === lang);
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    isSpeakingRef.current = true;
    utterance.onend = () => {
      isSpeakingRef.current = false;
      startRecognition();
    };

    synth.speak(utterance);
  };

  const handleCommand = (data) => {
    const { type, userInput, response } = data;

    switch (type) {
      case 'general':
        speak(response);
        break;
      case 'google_search':
        speak(response);
        window.open(`https://www.google.com/search?q=${encodeURIComponent(userInput)}`, '_blank');
        break;
      case 'youtube_search':
      case 'youtube_play':
        speak(response);
        window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(userInput)}`, '_blank');
        break;
      case 'youtube_open':
        speak(response);
        window.open('https://www.youtube.com', '_blank');
        break;
      case 'calculator_open':
        speak(response);
        window.open('https://www.google.com/search?q=calculator', '_blank');
        break;
      case 'instagram_open':
        speak(response);
        window.open('https://www.instagram.com', '_blank');
        break;
      case 'facebook_open':
        speak(response);
        window.open('https://www.facebook.com', '_blank');
        break;
      case 'weather_show':
        speak(response);
        window.open(`https://www.google.com/search?q=weather+in+my+location`, '_blank');
        break;
      default:
        console.warn('Unknown type:', type);
        break;
    }
  };

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = 'en-US';
    recognitionRef.current = recognition;

    const safeRecognition = () => {
      if (!isSpeakingRef.current && !isRecognizingRef.current) {
        try {
          recognition.start();
          console.log('Recognition requested to start');
        } catch (error) {
          if (error.name !== 'InvalidStateError') {
            console.error('Start error:', error);
          }
        }
      }
    };

    recognition.onstart = () => {
      console.log('Recognition started');
      isRecognizingRef.current = true;
      setListening(true);
    };

    recognition.onend = () => {
      console.log('Recognition ended');
      isRecognizingRef.current = false;
      setListening(false);
      if (!isSpeakingRef.current) {
        setTimeout(() => {
          safeRecognition();
        }, 1000);
      }
    };

    recognition.onerror = (e) => {
      console.warn('Recognition error:', e.error);
      isRecognizingRef.current = false;
      setListening(false);
      if (e.error !== 'aborted' && !isSpeakingRef.current) {
        setTimeout(() => {
          safeRecognition();
        }, 1000);
      }
    };

    recognition.onresult = async (e) => {
      const transcript = e.results[e.results.length - 1][0].transcript.trim();
      console.log('hear:', transcript);
      if (transcript.toLowerCase().includes(userData.assistantName.toLowerCase())) {
        recognition.stop();
        recognitionRef.current = null;
        setListening(false);
        const data = await getGeminiResponse(transcript);
        console.log('Gemini data:', data);
        handleCommand(data);
      }
    };

    const fallback = setInterval(() => {
      if (!isSpeakingRef.current && !isRecognizingRef.current) {
        safeRecognition();
      }
    }, 10000);

    safeRecognition();

    return () => {
      recognition.stop();
      setListening(false);
      isRecognizingRef.current = false;
      clearInterval(fallback);
    };
  }, []);

  return (
    <div className='w-full h-[100vh] bg-gradient-to-t from-[black] to-[#22226a] flex justify-center items-center flex-col gap-[15px] '>
      <button
        className='min-w-[150px] h-[60px] mt-[30px] bg-white rounded-full text-black font-semibold absolute top-[20px] right-[20px] text-[19px] cursor-pointer'
        onClick={handleLogOut}
      >
        Log Out
      </button>

      <button
        className='min-w-[150px] h-[60px] mt-[30px] bg-white rounded-full text-black font-semibold absolute top-[100px] right-[20px] text-[19px] cursor-pointer px-[20px] py-[10px] '
        onClick={() => navigate('/customize')}
      >
        Customize your Assistant
      </button>

      <div className='w-[300px] h-[400px] flex justify-center items-center overflow-hidden rounded-4xl shadow-lg'>
        <img src={userData?.assistantImage} alt='' className='h-full object-cover' />
      </div>
      <h1 className='text-white text-[18px] font-semibold '>I'm {userData?.assistantName}</h1>
    </div>
  );
}

export default Home;