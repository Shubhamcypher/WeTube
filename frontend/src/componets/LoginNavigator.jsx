import React from 'react';
import styled from 'styled-components';
import Alert from '@mui/material/Alert';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
    width: 720px;
`;

const Wrapper = styled.div`
    position: relative;
`;

const ButtonWrapper = styled.div`
    position: absolute;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
    display: flex;
    gap: 10px;
`;

const YesButton = styled.button`
    background-color: #32cd32;
    border-radius: 15px;
    color: ${({ theme }) => theme.text};
    height: 30px;
    width: 50px;
    cursor: pointer;
    font-size: 12px;
    text-align: center;
    &:hover {
        background-color: #008000; 
    }
`;

const NoButton = styled.button`
    background-color: #ff6347;
    border-radius: 15px;
    color: ${({ theme }) => theme.text};
    height: 30px;
    width: 50px;
    cursor: pointer;
    font-size: 12px;
    text-align: center;
    &:hover {
        background-color: #ff0000 ; 
    }
`;

const LoginNavigator = ({ setLoginNavigator }) => {
    const navigate = useNavigate();

    const handleYes = () => {
        navigate('/signin');
        setLoginNavigator(true);
    };

    const handleNo = () => {
        setLoginNavigator(false);
    };

    return (
        <Container>
            <Wrapper>
                <Alert variant="filled" severity="warning" >
                    Do you want to Login ?
                </Alert>
                <ButtonWrapper>
                    <YesButton onClick={handleYes}>Yes</YesButton>
                    <NoButton onClick={handleNo}>No</NoButton>
                </ButtonWrapper>
            </Wrapper>
        </Container>
    );
};

export default LoginNavigator;
