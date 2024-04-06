import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import axios from 'axios'

const Container = styled.div`
    width: 52vw;
    // height: 200vh;
    position: absolute;
    display: flex;
    align-items: center;
    justify-content:center;
`
const Wrapper = styled.div`
    width: 500px;
    height: 60px;
    position: fixed;
    bottom: 200px;
    right: 290px;
    background-color: #a67b5b;
    // background-color: ${({ theme }) => theme.bgLighter};
    color: ${({ theme }) => theme.text};
    padding: 10px;
    border-radius: 20px;
    display: flex;
    align-items:center;
    z-index:3;
`


const Info = styled.h3`
    display: flex;
    justify-content: space-evenly;
    align-items:center;
    // padding-left: 10px;
    background: transparent;
    color:${({theme})=>theme.text};
    height: 40px;
    width: inherit;
    border-radius: 15px;
    font-size:18px;
`
const YesButton = styled.button`
    background-color: #4169e1;
    border-radius: 15px;
    color: ${({ theme }) => theme.text};
    height: 30px;
    width: 50px;
    cursor:pointer;
    font-size:12px;
    text-align: center;
    &:hover {
        background-color:red; 
      }
`

const NoButton = styled.button`
    background-color: #4169e1;
    border-radius: 15px;
    color: ${({ theme }) => theme.text};
    height: 30px;
    width: 50px;
    cursor:pointer;
    font-size:12px;
    text-align: center;
    &:hover {
        background-color:green; 
      }
`

const Delete = ({setShowOption,setDeleteMenu,video}) => {
    const containerRef = useRef(null)

    useEffect(() => {
        const handleClickOutside = (e) => {
          if (containerRef.current && !containerRef.current.contains(e.target)) {
            setDeleteMenu(false);
            // setShowOption(false);
          }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }, []);

      const handleYes = async()=>{
        try {
           const res = await axios.delete(`/api/video/${video._id}`) 
            if(res.status===200)
            setShowOption(false);
            window.location.reload();
            
        } 
        catch (error) {
            console.log(error);
        }
      }

      const handleNo = async()=>{
        setDeleteMenu(false)
      }

    
  return (
    <Container ref={containerRef}>
        <Wrapper>
          <Info>
            Are you sure want to delete this video
            <YesButton onClick={handleYes}>Yes</YesButton>
            <NoButton onClick={handleNo}>No</NoButton>
          </Info>
        </Wrapper>
    </Container>
  )
}

export default Delete