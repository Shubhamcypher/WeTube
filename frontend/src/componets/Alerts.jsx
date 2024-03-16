import React, { useState } from 'react'

import Alert from '@mui/material/Alert';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';


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


const Alerts = ({}) => {
    const [showAlert, setShowAlert] = useState(false);
    const {currentUser} = useSelector(state=>state.user)

    const navigate = useNavigate()


      
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
      

  return (
    <>
        {showAlert && (<StyledAlert severity="warning">
          You won't be able to use complete features of WeTube without logging in...Choose Login or Register to like,subscribe and more premium features
          <br/>  
          <AlertButton onClick={handleLogin} color="green">
            Login
          </AlertButton>
          <AlertButton onClick={handleRegister} color="blue">
            Register
          </AlertButton>
          <AlertButton onClick={handleContinue} color="red">
            Continue without logging in
          </AlertButton>
        </StyledAlert>)}
    </>
  )
}

export default Alerts;