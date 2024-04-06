import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

const Container = styled.div`
    width: 52vw;
    height: 0;
    position: absolute;
    display: flex;
    align-items: center;
    justify-content:center;
`
const Wrapper = styled.div`
    width: 600px;
    height: 150px;
    position: fixed;
    bottom: 200px;
    right: 290px;
    background-color: ${({ theme }) => theme.bgLighter};
    color: ${({ theme }) => theme.text};
    padding: 20px;
    border-radius: 20px;
    z-index:2;
`
const Copy = styled.div`
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: space-evenly;
    align-items: center;
    gap:15px;
`

const Input = styled.input`
    display: flex;
    padding-left: 10px;
    background: transparent;
    color:${({theme})=>theme.text};
    height: 40px;
    width: inherit;
    border-radius: 15px;
    font-size:18px;
`
const Button = styled.button`
    background-color: ${({ copied }) => (copied ? 'green' : '#4169e1')};
    border-radius: 15px;
    color: ${({ theme }) => theme.text};
    height: 40px;
    width: 80px;
    cursor:pointer;
    font-size:16px;
    text-align: center;
    box-shadow: 1px 1px 1px 1px crimson;
`

const Share = ({setOpenShare, video}) => {
    const inputRef = useRef(null);
    const containerRef = useRef(null)
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const handleClickOutside = (e) => {
          if (containerRef.current && !containerRef.current.contains(e.target)) {
            setOpenShare(false);
          }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }, []);

    const handleCopy = () => {
        const currentURL = video?`http://localhost:5173/video/${video._id}`:window.location.href;
        if (inputRef.current) {
            inputRef.current.select();
            navigator.clipboard.writeText(currentURL);
            setCopied(true);
        }

      };
  return (
    <Container ref={containerRef}>
        <Wrapper>
            <Copy>
                <Input value={video?`http://localhost:5173/video/${video._id}`:window.location.href} writable='false' ref={inputRef}/>
                <Button onClick={handleCopy} copied={copied}>{copied ? 'Copied!' : 'Copy'}</Button>
            </Copy>
        </Wrapper>
    </Container>
  )
}

export default Share