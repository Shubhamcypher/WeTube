import styled from "styled-components";
import Alert from '@mui/material/Alert';
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from "react-redux";
import axios from 'axios'
import { Link, useNavigate } from "react-router-dom";

import GoogleIcon from '@mui/icons-material/Google';
import SwitchAccountIcon from '@mui/icons-material/SwitchAccount';
import LogoutIcon from '@mui/icons-material/Logout';
import CameraIcon from '@mui/icons-material/Camera';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import FolderCopyIcon from '@mui/icons-material/FolderCopy';
import GTranslateIcon from '@mui/icons-material/GTranslate';
import LightModeIcon from '@mui/icons-material/LightMode';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import LanguageIcon from '@mui/icons-material/Language';
import SettingsIcon from '@mui/icons-material/Settings';
import HelpIcon from '@mui/icons-material/Help';
import FlagIcon from '@mui/icons-material/Flag';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';

import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import app from '../firebase.js'
import { updateAvatar } from "../redux/userSlice.js";




const LogoutButton = styled(LogoutIcon)`
  cursor: pointer;
`;



const Container = styled.div`
  position: fixed;
  top: 5px; /* Correcting the 'top' value to have a unit */
  right: 0;
  background-color: transparent;
  display: flex;
  flex-direction: column; /* Ensuring the items stack vertically */
  z-index: 999;
  max-height: 100vh; /* Limit the height to the viewport height */
  overflow-y: auto; /* Enable vertical scrolling */
`;

const Wrapper = styled.div`
  width: 280px;
  height: 600px;
  background-color: ${({ theme }) => theme.bgLighter};
  color: ${({ theme }) => theme.text};
  padding: 20px 4px;
  margin: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  position: relative;
  left:0;
  border-radius:4%;
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  height: 40px;
  padding: 0px 12px;
  width: auto;
  &:hover {
    background-color: ${({ theme }) => theme.soft};
    border-radius : 7.5px;
  }
`;
const LogoutContainer=styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  height: 40px;
  width: auto;
  &:hover {
    background-color: ${({ theme }) => theme.soft};
    border-radius : 7.5px;
    color: red;
  }
`
const Title = styled.h1`
    font-size:24px;
    font-weight:800;
    color:${({theme})=>theme.text};
    display:flex;
    align-items:center;
    justify-content:space-between;
    flex-wrap:wrap;
    padding: 0 5px;
`;


const Hr = styled.hr`
    
    border:0.5px solid ${({theme})=>theme.soft};;
`

const Avatar = styled.img`
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background-color: #999;
      object-fit:cover;
`;
const AvatarInContainer = styled.img`
      width: 100%;
      height: 100%;
      border-radius: 2%;
      background-color: #999;
      object-fit:cover;
`;

const AvatarContainer = styled.div`
    height:60vh;
    width:40vw;
    display:flex;
    position: fixed;
    justify-content:center;
    align-items:center;
    z-index:999;
    color: ${({ theme }) => theme.text};
    padding:20px;

    @media (max-width: 720px) { 
      width:60vw;
}
`;
const AvatarWrapper = styled.div`
    height:100%;
    width:100%;
    background-color: ${({ theme }) => theme.bgLighter};
    border-radius:15px;
    display:flex;
    flex-direction:column;
    justify-content:center;
    align-items:center;
    margin-left:40px;
    padding:10px;
`;
const ButtonContainer = styled.div`
    display:flex;
    justify-content:space-between;
    width:100%;
    padding:20px;

    @media (max-width: 720px) { 
      flex-direction:column;
      gap:20px;
}
    
`;



const MyProfile = ({setOpenProfile,setShowAlert,darkMode, setDarkMode, setOpen, setDeleteAccountMenu}) => {
    const containerRef = useRef(null);
    const avatarContainerRef = useRef(null);
    const {currentUser} = useSelector((state)=>state.user)
    

    const navigate = useNavigate()

    const [userLocation, setUserLocation] = useState(null);
    const [userLocationName, setUserLocationName] = useState(null);
    const [avatarContainer, setAvatarContainer] = useState(false)
    const [imageFile, setImageFile] = useState('')
    const [imagePercentage, setImagePercentage] = useState('')

    const dispatch = useDispatch()
    


    const handleLogout = ()=>{
        setShowAlert(true)
        setOpenProfile(false) 
    }

    const handleDeleteAccount = ()=>{
        setDeleteAccountMenu(true)
        setOpenProfile(false)
    }

    useEffect(() => {
        const handleClickOutside = (e) => {
          if (containerRef.current && !containerRef.current.contains(e.target)) {
            setOpenProfile(false);
          }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }, [setOpenProfile]);

    useEffect(() => {
        const handleClickOutsideimageContainer = (e) => {
          if (avatarContainerRef.current && !avatarContainerRef.current.contains(e.target)) {
            setAvatarContainer(false);
          }
        };
        document.addEventListener('mousedown', handleClickOutsideimageContainer);
        return () => {
          document.removeEventListener('mousedown', handleClickOutsideimageContainer);
        };
      }, [avatarContainer]);

      useEffect(() => {
        const fetchUserLocation = () => {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              setUserLocation({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              });
            },
            (error) => {
              console.error('Error getting user location:', error.message);
            }
          );
        };
    
        fetchUserLocation();
      }, []);

      useEffect(() => {
        if (userLocation) {
          const reverseGeocode = async () => {
            const {latitude,longitude} = userLocation;
            try {
              const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    // You can optionally include other headers here
                },
                credentials: 'same-origin'  // Adjust credentials mode as per your needs
            });
            
            const dataFromLocation = await response.json(); // Assuming the response is JSON
              // Extract location data from response
              const { address } = dataFromLocation;
              // Construct location name based on available address components
              let locationName = '';
              if (address) {
                if (address.city) {
                  locationName += address.city + ', ';
                }
                if (address.state) {
                  locationName += address.state + ', ';
                }
                if (address.country) {
                  locationName += address.country;
                }
              }
              setUserLocationName(locationName)
            } catch (error) {
              console.error('Error fetching location name:', error.message);
              return null;
            }
          };
      
          reverseGeocode();
        }
      }, [userLocation]);

      const handleAvatarClick = () => {
        setAvatarContainer(true);
      };
    
      
    
      const handleAddAvatar = async () => {
        if (!imageFile) return;
        const storage = getStorage(app);
        const fileName = new Date().getTime() + "-" + imageFile.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, imageFile);
    
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setImagePercentage(Math.round(progress));
          },
          (error) => {
            console.error("Error uploading avatar:", error.message);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then(async(downloadURL) => {
              dispatch(updateAvatar(downloadURL));
              const res = await axios.patch(`/user/avatar`, { imageFileUrl: downloadURL });
              console.log(res);
              setOpenProfile(false);
            });
          }
        );
        
      };
    
      const handleDeleteAvatar = async () => {
        try {
          const res = await axios.patch("/user/avatar/delete");
          dispatch(updateAvatar(null)); // Update avatar to null in Redux state

          setOpenProfile(false);
        } catch (error) {
          console.error("Error deleting avatar:", error.message);
        }
      };



  return (
    <div ref={containerRef}>
    <Container>
        <Wrapper>
            <Title>
                <button style={{backgroundColor:'transparent', border:'none'}} onClick={handleAvatarClick}>
                <Avatar src={currentUser.img} style={{cursor:'pointer'}} />
                </button>
                {currentUser.name}
            </Title>
            <Hr/>
            {currentUser.fromGoogle && 
            <>
            <Link to="https://myaccount.google.com/" target="blank" rel="noopener noreferrer" style={{textDecoration:"none", color:'inherit'}}>
            <Item>
                <GoogleIcon />
                Google Account 
            </Item>
            </Link>

            <Item>
                <SwitchAccountIcon/>
                Switch Account
            </Item>
            </>}
            <LogoutContainer>
              <Item onClick={handleLogout} >
                    <LogoutButton/>
                    Logout
              </Item>
            </LogoutContainer>

            <LogoutContainer>
              <Item onClick={handleDeleteAccount}>
                <PersonRemoveIcon/>
                Delete Account
              </Item>
            </LogoutContainer>
            
            <Hr/>
            <Item onClick={()=>setOpen(true)}>
              <CameraIcon/>
              Youtube studio
            </Item>
            <Item>
              <LocalAtmIcon/>
              Purrchase and memberships
            </Item>
            <Hr/>
            <Item>
              <FolderCopyIcon/>
              Your data in WeTube
            </Item>
            <Item>
              <GTranslateIcon/>
              Language
            </Item>
            <Item onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? <LightModeIcon /> : <Brightness4Icon />}
              {darkMode ? 'Light' : 'Dark'} Mode
          </Item>
          <Item>
              <LanguageIcon/>
              Location <div style={{color:'green'}}>{userLocationName}</div>
          </Item>
          <Hr/>
          <Item>
              <SettingsIcon />
              Settings
          </Item>
          <Item>
              <HelpIcon />
              Help
        </Item>
        <Item>
              <FlagIcon />
              Report
        </Item>
        </Wrapper>
    </Container>
    {avatarContainer&&(
      <AvatarContainer ref={avatarContainerRef}>
        <AvatarWrapper>
          <AvatarInContainer src={currentUser.img} style={{cursor:'pointer', objectFit:'cover'}} />
          <ButtonContainer >
          <div>{imagePercentage>0?("Uploading: "+ imagePercentage+ "%"):(<input type='file' accept='image/*' onChange={(e)=>setImageFile(e.target.files[0])}/>)}</div>
          {currentUser.img?(
           <div style={{display:'flex',gap:'15px' }}>
             {imageFile&&<button style={{padding:'5px', backgroundColor:'yellow',border:'none',width:'70px', borderRadius:'6%'}} onClick={handleAddAvatar}>Change</button>}
             <button style={{padding:'5px', backgroundColor:'red' ,border:'none', width:'70px',borderRadius:'6%' }} onClick={handleDeleteAvatar}>Delete</button>
           </div>
          ):(
            <div>
              <button style={{padding:'5px', backgroundColor:'green',border:'none',width:'70px', borderRadius:'6%'}} onClick={handleAddAvatar}>Add</button>
              
            </div>
          )}
          </ButtonContainer>
        </AvatarWrapper>
      </AvatarContainer>
    )}
    </div>
  )
}

export default MyProfile