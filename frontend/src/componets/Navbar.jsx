import React, { useState } from 'react'
import styled from 'styled-components';

import PersonIcon from '@mui/icons-material/Person';
import SearchIcon from '@mui/icons-material/Search';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import LogoutIcon from '@mui/icons-material/Logout';
import Alert from '@mui/material/Alert';



import {useDispatch, useSelector} from 'react-redux'
import Upload from './Upload';
import { useLocation, useNavigate } from 'react-router-dom';
import { logout } from '../redux/userSlice';

const Container = styled.div`
  position: sticky;
  top: 0;
  background-color:${({theme})=>theme.bgLighter};
  height: 56px;
  `
  const Wrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 100%;
  padding: 0px 20px;
  position: relative;
`

const Search = styled.div`
  position: absolute;
  left: 0px;
  right: 0px;
  margin: auto;
  width:40%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 7px;
  color: ${({theme})=>theme.text};
`

const Input = styled.input`
  border:none;
  background-color: transparent;
  width:100%;
  outline:none;
  color: ${({theme})=>theme.text};
`

const Button = styled.button`
    padding: 5px 15px;
    background-color: transparent ;
    color: #3ae;
    border: 1px solid #3ae;
    border-radius:3px;
    font-weight: 500;
    cursor: pointer;
    display:flex;
    align-items:center;
    justify-content:center;
    gap:3px;

`;

const User = styled.div`
      display:flex;
      align-items:center;
      gap:10px;
      font-weight: 500;
      color:  ${({theme})=>theme.text};
`

const Avatar = styled.img`
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background-color: #999;
`;

const LogoutButton = styled(LogoutIcon)`
  cursor: pointer;

  &:hover {
    color: red;
  }
`;








const Navbar = () => {
const {currentUser} = useSelector(state=>state.user)
const [open, setOpen] = useState(false)
const [q, setQ] = useState("")
const [showAlert, setShowAlert] = useState(false);


const navigate = useNavigate()
const dispatch = useDispatch()

const handleLogout = ()=>{
  dispatch(logout())
  navigate('/')
  setShowAlert(true)

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
  // Continue with current action
};





  return (
    <>
    <Container>
      <Wrapper>
        <Search>
          <Input placeholder="Search" onChange={(e)=>setQ(e.target.value)}/>
          <SearchIcon onClick={()=>navigate(`/search?q=${q}`)} style={{cursor:'pointer'}}/>
        </Search>
        {currentUser  ?(
          <User>
            <VideoCallIcon onClick={()=>setOpen(true)} style={{cursor:'pointer'}}/>
            <Avatar src={currentUser.img} style={{cursor:'pointer'}}/>
            {currentUser.name}
            <LogoutButton onClick={handleLogout} />
          </User>
        ) : <a href='/signin' style={{textDecoration:"none"}}>
            <Button>
                <PersonIcon/> Sign in
            </Button>
        </a>}
        {open && (<Upload setOpen={setOpen} />  )}
      </Wrapper>
      {showAlert && (
    <Alert severity="info" style={{ backgroundColor: 'grey' }}>
      <div style={{display: 'flex', justifyContent:'space-between'}}>
    <div>You are not logged in. What would you like to do?</div>
    <Button onClick={handleLogin} style={{ backgroundColor: 'green', color: 'white' }}>
      Login
    </Button>
    <Button onClick={handleRegister} style={{ backgroundColor: 'blue', color: 'white' }}>
      Register
    </Button>
    <Button onClick={handleContinue} style={{ backgroundColor: 'red', color: 'white' }}>
      Continue without logging in
    </Button>
            
    </div>
    </Alert>
  )}
    </Container>
    
    
   
    </>
  )
}

export default Navbar