import styled from "styled-components";
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



const LogoutButton = styled(LogoutIcon)`
  cursor: pointer;
`;

const Container = styled.div`
  position: fixed;
  top: 10;
  right:0;
  background-color: transparent;
  display: flex;
  z-index:999;
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
display:flex;
gap: 10px;
&:hover {
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
    padding: 0 20px;
`;


const Hr = styled.hr`
    
    border:0.5px solid ${({theme})=>theme.soft};;
`

const Avatar = styled.img`
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background-color: #999;
`;



const MyProfile = ({setOpenProfile,setShowAlert,darkMode, setDarkMode, setOpen}) => {
    const containerRef = useRef(null);
    const {currentUser} = useSelector((state)=>state.user)

    const navigate = useNavigate()

    const [userLocation, setUserLocation] = useState(null);
    const [userLocationName, setUserLocationName] = useState(null);

    const dispatch = useDispatch()

    const handleLogout = ()=>{
        setShowAlert(true)
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
              const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
              // Extract location data from response
              const { address } = response.data;
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

  return (
    <Container ref={containerRef}>
        <Wrapper>
            <Title>
                <Avatar src={currentUser.img} style={{cursor:'pointer'}} />
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
            <Item onClick={handleLogout} >
                <LogoutContainer>
                    <LogoutButton/>
                    Logout
                </LogoutContainer>
            </Item>
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
  )
}

export default MyProfile