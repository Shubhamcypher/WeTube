import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components';
import axios from 'axios'

import PersonIcon from '@mui/icons-material/Person';
import SearchIcon from '@mui/icons-material/Search';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import Alert from '@mui/material/Alert';
import NotificationsIcon from '@mui/icons-material/Notifications';




import {useDispatch, useSelector} from 'react-redux'
import Upload from './Upload';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../redux/userSlice';
import MyProfile from './MyProfile';

const Container = styled.div`
  position: sticky;
  top: 0;
  background-color:${({theme})=>theme.bgLighter};
  height: 56px;
  z-index:999;
  display:flex;
  flex-direction: row-reverse;
  gap:10px;
  `
  const Wrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 100%;
  padding: 0px 20px;
`

const Search = styled.div`
  position: fixed;
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

  @media (max-width: 720px) { 
    position:relative;
    width:50%
}
`

const Input = styled.input`
  border:none;
  background-color: transparent;
  width:90%;
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
`;

const User = styled.div`
      display:flex;
      align-items:center;
      gap:20px;
      color:  ${({theme})=>theme.text};
`

const Avatar = styled.img`
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background-color: #999;
`;


const VideoButton = styled(VideoCallIcon)`
  cursor: pointer;
  
  &:hover {
    color: #00B5E2;
    transform: scale(1.3);
     transition: transform 0.8s ease, color 0.8s ease;
  }
`;

const StyledAlert = styled(Alert)`
  background-color: ${({theme})=>theme.bgLighter} !important;
  color: ${({theme})=>theme.text} !important;
  border-radius: 8px;
  margin: 10px;
  position:fixed;
  z-index:999;
  top:10;
  display:flex;
  width:50vw;

   @media (max-width: 720px) { 
    width:80vw;
    margin:2px 25px;
}
`;

const LogoutText = styled.div`
    @media (max-width: 720px) { 
    display:none;
}
`;

const DeleteAccountText = styled.div`
    @media (max-width: 720px) { 
    display:none;
}
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
  position:relative;

  &:hover {
    opacity: 0.8;
  }
`;

const ButtonWrapper = styled.div`
    position: absolute;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
    display: flex;
    gap: 0px;
`;








const Navbar = ({darkMode, setDarkMode}) => {
const {currentUser} = useSelector(state=>state.user)
const [open, setOpen] = useState(false)
const [openProfile, setOpenProfile] = useState(false)
const [q, setQ] = useState("")
const [showAlert, setShowAlert] = useState(false);
const [deleteAccountMenu, setDeleteAccountMenu] = useState(false)

const alertlRef = useRef(null);



const navigate = useNavigate()
const dispatch = useDispatch()



useEffect(() => {
  const handleClickOutside = (e) => {
    if (alertlRef.current && !alertlRef.current.contains(e.target)) {
      setShowAlert(false);
    }
  };
  document.addEventListener('mousedown', handleClickOutside);
  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
}, [setShowAlert]);

const handleSwitch = () => {
  dispatch(logout())
  setShowAlert(false);
  navigate('/signin');
};

const handleCancel = () => {
  setShowAlert(false);
};

const handleLogoutAndContinue = () => {
  dispatch(logout())
  setShowAlert(false);
  navigate('/')
};

const handleYesDeleteAccount = async()=>{
  setDeleteAccountMenu(false)
  await axios.delete(`/user/${currentUser._id}`)
  dispatch(logout())
  navigate('/signin')
  
}
const handleNoDeleteAccount =()=>{
  setDeleteAccountMenu(false)
}

  return (
    <>    
    <Container>
      <Wrapper>
        <Search>
          <Input placeholder="Search" onChange={(e)=>setQ(e.target.value)}/>
          <SearchIcon onClick={()=>q&&navigate(`/search?q=${q}`)} style={{cursor:'pointer'}}/>
        </Search>
        {currentUser  ?(
          <User>
            <VideoButton onClick={()=>setOpen(true)}  fontSize="large"/>
            <NotificationsIcon fontSize="large"/>
            <Avatar src={currentUser.img} style={{cursor:'pointer'} } onClick={()=>setOpenProfile(!openProfile)}/>
          </User>
        ) : <Link to='/signin' style={{textDecoration:"none"}}>
            <Button>
                <PersonIcon fontSize="sm"/> Sign in
            </Button>
        </Link>}     
      </Wrapper>
    </Container>


    {open && <Upload setOpen={setOpen} />}

    {showAlert && (
        <StyledAlert severity="warning" ref={alertlRef}>
          <div>
          <LogoutText >
          You won't be able to use complete features.
          </LogoutText>
          <div>
          <ButtonWrapper>
          <AlertButton onClick={handleSwitch} color="blue">
            Switch Account
          </AlertButton>
          <AlertButton onClick={handleCancel} color="green" >
            Cancel
          </AlertButton>
          <AlertButton onClick={handleLogoutAndContinue} color="red">
            Logout
          </AlertButton>
          </ButtonWrapper>
          </div>
          </div>
        </StyledAlert>
      )}

      {deleteAccountMenu && (
        <StyledAlert severity="warning" >
        <DeleteAccountText>
        Are you sure want to delete {currentUser.name}? 
        </DeleteAccountText>
        <ButtonWrapper>
        <AlertButton onClick={handleYesDeleteAccount} color="red">
          Yes
        </AlertButton>
        <AlertButton onClick={handleNoDeleteAccount} color="green" >
          No
        </AlertButton>
        </ButtonWrapper>
      </StyledAlert>
      )}

      {openProfile && <MyProfile setOpenProfile={setOpenProfile} setShowAlert={setShowAlert} darkMode={darkMode} setDarkMode={setDarkMode} setOpen={setOpen} setDeleteAccountMenu={setDeleteAccountMenu}/>}
    </>
  )
}

export default Navbar