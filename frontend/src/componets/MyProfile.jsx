import styled from "styled-components";
import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { logout } from '../redux/userSlice';

import GoogleIcon from '@mui/icons-material/Google';
import SwitchAccountIcon from '@mui/icons-material/SwitchAccount';
import LogoutIcon from '@mui/icons-material/Logout';


const LogoutButton = styled(LogoutIcon)`
  cursor: pointer;
`;

const Container = styled.div`
  position: fixed;
  top: 10;
  right:0;
  background-color: transparent;
  display: flex;
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
  z-index:900;
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
    justify-content:space-evenly;
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



const MyProfile = ({setOpenProfile,setShowAlert}) => {
    const containerRef = useRef(null);
    const {currentUser} = useSelector((state)=>state.user)

    const dispatch = useDispatch()

    const handleLogout = ()=>{
        setShowAlert(true)
        setOpenProfile(false)
        dispatch(logout())
        navigate('/')  
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
            <Item>
                <GoogleIcon/>
                Google Account 
            </Item>
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
        </Wrapper>
    </Container>
  )
}

export default MyProfile