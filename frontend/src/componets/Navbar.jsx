import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components';

import PersonIcon from '@mui/icons-material/Person';
import SearchIcon from '@mui/icons-material/Search';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import LogoutIcon from '@mui/icons-material/Logout';
import Alert from '@mui/material/Alert';
import NotificationsIcon from '@mui/icons-material/Notifications';




import {useDispatch, useSelector} from 'react-redux'
import Upload from './Upload';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
      gap:20px;
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
const VideoButton = styled(VideoCallIcon)`
  cursor: pointer;


  &:hover {
    color: #00B5E2;
    transform: scale(1.5)
  }
`;

const StyledAlert = styled(Alert)`
  background-color: inherit;
  border-radius: 8px;
  padding: 16px;
  position:fixed;
  width:720px;
  top:0;
  left:380px;
  z-index:1000;
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

const ButtonWrapper = styled.div`
    position: absolute;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
    display: flex;
    gap: 10px;
`;








const Navbar = ({darkMode, setDarkMode}) => {
const {currentUser} = useSelector(state=>state.user)
const [open, setOpen] = useState(false)
const [openProfile, setOpenProfile] = useState(false)
const [q, setQ] = useState("")
const [showAlert, setShowAlert] = useState(false);

const alertlRef = useRef(null);



const navigate = useNavigate()
const dispatch = useDispatch()



const handleLogout = ()=>{
  setShowAlert(true)

}

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
          You won't be able to use complete features of WeTube without logging in...  
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
        </StyledAlert>
      )}

      {openProfile && <MyProfile setOpenProfile={setOpenProfile} setShowAlert={setShowAlert} darkMode={darkMode} setDarkMode={setDarkMode} setOpen={setOpen}/>}
    </>
  )
}

export default Navbar