import React, { useState } from 'react'


import styled from 'styled-components'


import channel_logo from '../img/channel_logo.png'

import HomeIcon from '@mui/icons-material/Home';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';
import MenuIcon from '@mui/icons-material/Menu';
import SettingsIcon from '@mui/icons-material/Settings';


import { Link , useLocation, useNavigate} from 'react-router-dom';
import { useSelector } from 'react-redux';

const Container = styled.div`
    flex: 0.5;
    background-color: ${({theme})=>theme.bgLighter};
    color:${({theme})=>theme.text};
    position: sticky;
    top:0; 
    font-size:11px;
    
`;

const TopMenu = styled.div`
    display: flex;
    justify-content: space-between;
    gap:5px;
`


const Wrapper = styled.div`
    padding: 18px 22px;
    display:flex;
    flex-direction:column;
`;

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

const MenuItem = styled.div`
      display:flex;
      gap:30px;
      flex-direction:column;
`

const Item = styled.div`
  display: flex;
  flex-direction: column; 
  align-items: center; 
  gap:5px;
  cursor: pointer;
  padding: 7.5px 7px;
  width: auto;
  &:hover {
    background-color: ${({ theme }) => theme.soft};
    border-radius : 7.5px;
  }
`;
 



const ActiveIcon = styled.div`
 color : orange;
`;

const InactiveIcon = styled.div`
 color: inherit; 
 `;



const Menu2 = ({ setShowMenu, showMenu }) => {
  const { currentUser } = useSelector((state) => state.user);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleHamburger = ()=>{
    setShowMenu(!showMenu)
  }

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
          </Logo>
        </Link>
        </TopMenu>

        <MenuItem>
        {isActive('/') ? (
          <ActiveIcon>
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
              <Item>
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
                <div>Home</div>
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
                <div>Explore</div>
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
                <div>Explore</div>
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
                <div>Subscribes</div>
              </Item>
            </ActiveIcon>
          ) : (
              <InactiveIcon>
              <Item>
                <SubscriptionsIcon />
                <div>Subscribes</div>
              </Item> 
            </InactiveIcon>
            
          )}
        </Link>
        <Item>
          <SettingsIcon />
          <div>Settings</div>
        </Item>
        </MenuItem>
      </Wrapper>
    </Container>
  );
};

export default Menu2;