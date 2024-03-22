import React, { useState } from 'react'


import styled from 'styled-components'


import channel_logo from '../img/channel_logo.png'

import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import HistoryIcon from '@mui/icons-material/History';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import SportsBasketballIcon from '@mui/icons-material/SportsBasketball';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import MovieCreationIcon from '@mui/icons-material/MovieCreation';
import PersonIcon from '@mui/icons-material/Person';
import LiveTvIcon from '@mui/icons-material/LiveTv';
import SettingsIcon from '@mui/icons-material/Settings';
import FlagIcon from '@mui/icons-material/Flag';
import HelpIcon from '@mui/icons-material/Help';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import ModeNightIcon from '@mui/icons-material/ModeNight';
import NightlightIcon from '@mui/icons-material/Nightlight';
import Alert from '@mui/material/Alert';

import { Link , useLocation, useNavigate} from 'react-router-dom';
import { useSelector } from 'react-redux';






const Container = styled.div`
    flex: 1;
    background-color: ${({theme})=>theme.bgLighter};
    color:${({theme})=>theme.text};
    font-size:14px;
    z-index: 900;
    position: sticky;
    top:0;
    overflow-y: auto;
    height:100vh;

    &::-webkit-scrollbar {
      width: 10px; /* Width of vertical scrollbar */
  }
  &::-webkit-scrollbar-track {
      background: ${({ theme }) => theme.bgLighter}; /* Color of the track */
  }
  &::-webkit-scrollbar-thumb {
      background: transparent; /* Color of the thumb */
      border-radius: 5px; /* Rounded corners */
  }
  &::-webkit-scrollbar-thumb:hover {
      background: ${({ theme }) => theme.soft}; /* Color of the thumb on hover */
  }
`;


const Wrapper = styled.div`
    padding: 18px 26px;
    display:flex;
    flex-direction:column;
`;

const TopMenu = styled.div`
    display: flex;
    justify-content: space-between;
    gap:5px;
`

const HamburgerButton = styled.button`
  height:25px;
  background-color: transparent;
  border: none;
  outline: none;
  color: ${({theme})=>theme.text};
  cursor: pointer;
  &:hover {
    background-color: ${({ theme }) => theme.soft};
    border-radius : 7.5px;
  }
`;


const Logo = styled.div`
    display:flex;
    align-items:center;
    gap:5px;
    font-weight:bold;
    margin-bottom:25px;

    &:hover {
        transform: scale(1.2)
      }
`;
const Img = styled.img`
    height:25px;
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  cursor: pointer;
  padding: 7.5px 7px;
  width: auto;
  &:hover {
    background-color: ${({ theme }) => theme.soft};
    border-radius : 7.5px;
  }
`;


const Hr = styled.hr`
    margin:15px 0px;
    border:0.5px solid ${({theme})=>theme.soft};;
`

const Login = styled.div`
    
`

const Button = styled.button`
    padding: 5px 15px;
    background-color: transparent ;
    color: #3ae;
    border: 1px solid #3ae;
    border-radius:3px;
    font-weight: 500;
    margin-top:10px;
    cursor: pointer;
    display:flex;
    align-items:center;
    justify-content:center;
    gap:3px;

`

const Title = styled.h2`
    font-size:14px;
    font-weight:500;
    color:${({theme})=>theme.text};
    margin-bottom:20px;
`

const ActiveIcon = styled.div`
 color : orange;
`;

const InactiveIcon = styled.div`
 color: inherit; 
 `;

 const StyledAlert = styled(Alert)`
  background-color: inherit;
  border-radius: 8px;
  padding: 16px;
`;

const AlertButton = styled.button`
  padding: 8px 16px;
  background-color: ${({ color }) => color};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  margin-right: 8px;

  &:hover {
    opacity: 0.8;
  }
`;





const Menu = ({ darkMode, setDarkMode, setShowMenu, showMenu }) => {
  const { currentUser } = useSelector((state) => state.user);
  const location = useLocation();
  const navigate = useNavigate()
  const [showAlert, setShowAlert] = useState(false); // State for managing the alert
  

  const handleHamburger = ()=>{
    setShowMenu(!showMenu)
  }


  const handleLogin = () => {
    setShowAlert(false);
    navigate('/signin');
  };

  const handleRegister = () => {
    setShowAlert(false);
    navigate('/signin');
  };

  const handleContinue = () => {
    setShowAlert(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <Container>
      <Wrapper>

        <TopMenu>
        <HamburgerButton onClick={handleHamburger}>
          <MenuIcon/>
        </HamburgerButton>
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <Logo>
            <Img src={channel_logo} />
            WeTube
          </Logo>
        </Link>
        </TopMenu>

        {isActive('/') ? (
          <ActiveIcon>
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
              <Item style={{position:'sticky'}}>
                <HomeIcon />
                Home
              </Item>
            </Link>
          </ActiveIcon>
        ) : (
          <InactiveIcon>
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
              <Item>
                <HomeIcon />
                Home
              </Item>
            </Link>
          </InactiveIcon>
        )}

        {isActive('/trending') ? (
          <ActiveIcon>
            <Link
              to="/trending"
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <Item>
                <TravelExploreIcon />
                Explore
              </Item>
            </Link>
          </ActiveIcon>
        ) : (
          <InactiveIcon>
            <Link
              to="/trending"
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <Item>
                <TravelExploreIcon />
                Explore
              </Item>
            </Link>
          </InactiveIcon>
        )}

        <Link
          to={currentUser ? '/subscriptions' : '/'} style={{ textDecoration: 'none', color: 'inherit' }}
          onClick={(e)=>{
            {!currentUser && alert("Log in to use this feature")}
          }}>
            
          {isActive('/subscriptions') ? (
            <ActiveIcon>
              <Item>
                <SubscriptionsIcon />
                Subscribes
              </Item>
            </ActiveIcon>
          ) : (
              <InactiveIcon>
              <Item>
                <SubscriptionsIcon />
                Subscribes
              </Item> 
            </InactiveIcon>
          )}
        </Link>

        <Hr />
        <Item>
          <VideoLibraryIcon />
          Library
        </Item>
        <Item>
          <HistoryIcon />
          History
        </Item>
        <Hr />
        {!currentUser && (
          <>
            <Login>
              Sign in to like videos, comment and subscribe.
              <Link to="/signin" style={{ textDecoration: 'none' }}>
                <Button>
                  <PersonIcon /> Sign in
                </Button>
              </Link>
            </Login>
            <Hr />
          </>
        )}

        <Title>FEATURED</Title>

        <Item>
          <LibraryMusicIcon />
          Music
        </Item>
        <Item>
          <SportsBasketballIcon />
          Sports
        </Item>
        <Item>
          <SportsEsportsIcon />
          Gaming
        </Item>
        <Item>
          <MovieCreationIcon />
          Movies
        </Item>
        <Item>
          <NewspaperIcon />
          News
        </Item>
        <Item>
          <LiveTvIcon />
          Live
        </Item>
        <Hr />
        <Item>
          <SettingsIcon />
          Settings
        </Item>
        <Item>
          <FlagIcon />
          Report
        </Item>
        <Item>
          <HelpIcon />
          Help
        </Item>
        <Item onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? <ModeNightIcon /> : <NightlightIcon />}
          {darkMode ? 'Light' : 'Dark'}
        </Item>
      </Wrapper>
      {showAlert && (
        <StyledAlert severity="warning">
          You won't be able to use complete features of WeTube without logging
          in...Choose Login or Register to like, subscribe and more premium
          features
          <br />
          <AlertButton onClick={handleLogin} color="green">
            Login
          </AlertButton>
          <AlertButton onClick={handleRegister} color="blue">
            Register
          </AlertButton>
          <AlertButton onClick={handleContinue} color="red">
            Continue without logging in
          </AlertButton>
        </StyledAlert>
      )}
    </Container>
  );
};

export default Menu;