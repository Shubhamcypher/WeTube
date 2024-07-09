import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import GoogleIcon from '@mui/icons-material/Google';
import { loginFailure, loginStart, loginSuccess } from "../redux/userSlice";
import { auth,provider } from "../firebase.js";
import {signInWithPopup} from 'firebase/auth'
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 6px);
  color: ${({ theme }) => theme.text};
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  background-color: ${({ theme }) => theme.bgLighter};
  border: 1px solid ${({ theme }) => theme.soft};
  padding: 20px 50px;
  gap: 10px;
  border-radius: 20px;
`;

const Title = styled.h1`
  font-size: 24px;
`;

const SubTitle = styled.h2`
  font-size: 20px;
  font-weight: 300;
`;

const Input = styled.input`
  border: 1px solid ${({ theme }) => theme.soft};
  border-radius: 3px;
  padding: 10px;
  background-color: transparent;
  width: 100%;
  color: ${({ theme }) => theme.text};
`;

const Button = styled.button`
  border-radius: 3px;
  border: none;
  padding: 10px 20px;
  font-weight: 500;
  cursor: pointer;
  background-color: ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.textSoft};
`;

const More = styled.div`
  display: flex;
  margin-top: 10px;
  font-size: 12px;
  color: ${({ theme }) => theme.textSoft};
`;

const Links = styled.div`
  margin-left: 30px;
`;

const Link = styled.span`
  margin-left: 20px;
`;

const GoogleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-items:center;
`

const SignIn = () => {

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [signupName, setSignupName] = useState('')
  const [signupEmail, setSignupEmail] = useState('')
  const [signupPassword, setSignupPassword] = useState('')


  const dispatch = useDispatch()

  const navigate = useNavigate()

  const handleLogin = async (e)=>{
    e.preventDefault();
    dispatch(loginStart())
    try {
      console.log("I am in frontend sigin page");
      const res = await axios.post("/auth/signin",{name,password});
      console.log(res);
      dispatch(loginSuccess(res.data))
      navigate('/')
    } 
    catch (error) {
      dispatch(loginFailure())
      
    }
  }

  const handleSignup = async (e)=>{
    e.preventDefault();
    try {

       await axios.post("/auth/signup",{
        name:signupName,
        password:signupPassword,
        email:signupEmail
      })
      alert(`signin successful, logging in with ${signupName}  account`)
      const res = await axios.post("/auth/signin",{
        name:signupName,
        password:signupPassword
      });
      dispatch(loginSuccess(res.data))
      navigate('/');
    } 
    catch (error) {
      console.log(error);
      
    }
  }

  const signinWithGoogle = async()=>{
    dispatch(loginStart())
    signInWithPopup(auth,provider)
    .then((result)=>{
      axios.post("/auth/googleAuth",{
        name: result.user.displayName,
        email: result.user.email,
        img: result.user.photoURL
      })
      .then((res)=>{
        dispatch(loginSuccess(res.data))
        navigate('/')
      })
    })
    .catch((error)=>{
      dispatch(loginFailure())
      console.log(error);
    })
  }

  return (
    <Container>
      <Wrapper>
        <Title>Sign in</Title>
        <SubTitle>to continue to WeTube</SubTitle>
        <Input placeholder="username" onChange={e=>setName(e.target.value)} />
        <Input type="password" placeholder="password" onChange={e=>setPassword(e.target.value)} />
        <Button  onClick={handleLogin}>Sign in</Button>
        <Title>or</Title>

        <GoogleContainer>
        <Button onClick={signinWithGoogle}><GoogleIcon/>Log in with google</Button>
        </GoogleContainer>
        <Title>or</Title>
        <Title>Sign up</Title>
        <Input placeholder="username" onChange={e=>setSignupName(e.target.value)}/>
        <Input placeholder="email" onChange={e=>setSignupEmail(e.target.value)} />
        <Input type="password" placeholder="password" onChange={e=>setSignupPassword(e.target.value)} />
        <Button onClick={handleSignup}>Sign up</Button>
      </Wrapper>
      <More>
        English(USA)
        <Links>
          <Link>Help</Link>
          <Link>Privacy</Link>
          <Link>Terms</Link>
        </Links>
      </More>
    </Container>
  );
};

export default SignIn;