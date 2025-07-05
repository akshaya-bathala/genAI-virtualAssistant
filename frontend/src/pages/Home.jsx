import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserDataContext } from '../context/UserDataContext';
import ai from "../assets/ai.gif"
import user from "../assets/user.gif"

function Home() {
  const { userData, serverUrl, setUserData, getGeminiResponse } = useContext(UserDataContext);
  const navigate = useNavigate();

  const [userText, setUserText] = useState("")
 const [aiText, setAiText] = useState("") 

  const [listening, setListening] = useState(false);
  const [voiceUnlocked, setVoiceUnlocked] = useState(false);

  const recognitionRef = useRef(null);
  const isSpeakingRef = useRef(false);
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

  const speak = (text, lang = 'en-US') => {
    if (!voiceUnlocked || !text) return;

    if (synth.speaking) synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;

    const loadAndSpeak = () => {
      const voices = synth.getVoices();
      const selectedVoice = voices.find((v) => v.lang === lang || v.lang.startsWith('en'));

      if (selectedVoice) utterance.voice = selectedVoice;

      isSpeakingRef.current = true;
      utterance.onend = () => {
        setAiText("")
        isSpeakingRef.current = false;
        startRecognition();
      };

      synth.speak(utterance);
    };

    if (!synth.getVoices().length) {
      synth.onvoiceschanged = loadAndSpeak;
    } else {
      loadAndSpeak();
    }
  };

  const startRecognition = () => {
    if (recognitionRef.current && !isSpeakingRef.current && !isRecognizingRef.current) {
      try {
        recognitionRef.current.start();
      } catch (err) {
        if (!err.message.includes('start')) {
          console.error('Recognition start error:', err);
        }
      }
    }
  };

  const stopRecognition = () => {
    if (recognitionRef.current && isRecognizingRef.current) {
      recognitionRef.current.stop();
    }
  };

  const handleCommand = (data, userInput) => {
    const { type, response } = data;

    speak(response);

    switch (type) {
      case 'google_search':
        window.open(`https://www.google.com/search?q=${encodeURIComponent(userInput)}`, '_blank');
        break;
      case 'youtube_search':
      case 'youtube_play':
        window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(userInput)}`, '_blank');
        break;
      case 'youtube_open':
        window.open('https://www.youtube.com', '_blank');
        break;
      case 'calculator_open':
        window.open('https://www.google.com/search?q=calculator', '_blank');
        break;
      case 'instagram_open':
        window.open('https://www.instagram.com', '_blank');
        break;
      case 'facebook_open':
        window.open('https://www.facebook.com', '_blank');
        break;
      case 'weather_show':
        window.open(`https://www.google.com/search?q=weather+in+my+location`, '_blank');
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech Recognition not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = 'en-US';

    recognitionRef.current = recognition;

    recognition.onstart = () => {
      isRecognizingRef.current = true;
      setListening(true);
      console.log("Recognition started");
    };

    recognition.onend = () => {
      isRecognizingRef.current = false;
      setListening(false);
      console.log("Recognition ended");

      if (!isSpeakingRef.current) {
        setTimeout(() => {
          startRecognition();
        }, 1000);
      }
    };

    recognition.onerror = (e) => {
      isRecognizingRef.current = false;
      setListening(false);
      console.warn('Recognition error:', e.error);

      if (e.error !== 'aborted' && !isSpeakingRef.current) {
        setTimeout(() => {
          startRecognition();
        }, 1000);
      }
    };

    recognition.onresult = async (e) => {
  const transcript = e.results[e.results.length - 1][0].transcript.trim();
  console.log('Heard:', transcript);

  const assistantName = userData.assistantName.toLowerCase();
  const loweredTranscript = transcript.toLowerCase();

  if (loweredTranscript.includes(assistantName)) {
    setUserText(transcript)
    setAiText("")
    stopRecognition();


    // Remove assistant name only once (at start or anywhere)
    const cleanInput = loweredTranscript.replace(assistantName, '').trim();

    console.log('Sending to Gemini:', cleanInput);

    const data = await getGeminiResponse(cleanInput);
    console.log('Gemini response:', data);

    handleCommand(data, cleanInput);
    setAiText(data.response)
    setUserText("")
  }
};


    startRecognition();

    return () => {
      stopRecognition();
    };
  }, [voiceUnlocked]);

  return (
    <div className='w-full h-[100vh] bg-gradient-to-t from-black to-[#22226a] flex justify-center items-center flex-col gap-[15px]'>
      <button
        className='min-w-[150px] h-[60px] mt-[30px] bg-white rounded-full text-black font-semibold absolute top-[20px] right-[20px] text-[19px]'
        onClick={handleLogOut}
      >
        Log Out
      </button>

      <button
        className='min-w-[150px] h-[60px] mt-[30px] bg-white rounded-full text-black font-semibold absolute top-[100px] right-[20px] text-[19px]'
        onClick={() => navigate('/customize')}
      >
        Customize your Assistant
      </button>

      <div className='w-[300px] h-[400px] flex justify-center items-center overflow-hidden rounded-4xl shadow-lg'>
        <img src={userData?.assistantImage} alt='' className='h-full object-cover' />
      </div>

      <h1 className='text-white text-[18px] font-semibold '>I'm {userData?.assistantName}</h1>

      {!aiText &&  <img src={user} alt="" className='w-[200px]' />}
      {aiText &&  <img src={ai} alt="" className='w-[200px]' />}

      <div className='flex flex-col items-center mt-6 px-4 w-full max-w-[600px]'>
  {userText && (
    <div className='bg-white text-black p-4 rounded-xl mb-4 w-full shadow-md'>
      <p className='font-bold mb-1'>👤 You:</p>
      <p>{userText}</p>
    </div>
  )}

  {aiText && (
    <div className='bg-blue-100 text-black p-4 rounded-xl w-full shadow-md'>
      <p className='font-bold mb-1'>🤖 {userData?.assistantName}:</p>
      <p>{aiText}</p>
    </div>
  )}
</div>
     

      {!voiceUnlocked && (
        <button
          className='fixed bottom-6 right-6 bg-white text-black px-5 py-3 rounded-full shadow-md text-sm font-semibold z-50'
          onClick={() => {
            setVoiceUnlocked(true);
            synth.getVoices(); // preload
            console.log('Voice unlocked');
          }}
        >
          🔓 Enable Voice
        </button>
      )}
    </div>
  );
}

export default Home;
