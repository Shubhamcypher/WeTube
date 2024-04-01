import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { Link } from 'react-router-dom';

import {  useSelector } from 'react-redux';

const Container = styled.div`
    position: absolute;
`
const Wrapper = styled.div`
    position:relative;
    width:160px;
    top:30px;
    left:220px;
    color: ${({ theme }) => theme.text};
    border-radius:10px;
    // background-color: #FF9933;
    // background-color: transparent;
    background-color: ${({ theme }) => theme.soft};
    padding: 5px;
    z-index:1;
    

`
const Item = styled.div`
    display:flex;
    padding:5px;
    align-items:center;
    border-radius:5px;
    cursor: pointer;
    gap:8px;
    color:inherit;
    &:hover {
        background-color: ${({ theme }) => theme.bgLighter};
        color: ${(props)=>(props.special ? "red": "#336BFF")};
      }
`

const Hr = styled.hr`
  border: 0.5px solid ${({ theme }) => theme.light};
  margin: 2px;
`;

const Option = ({setShowOption, video}) => {
    const containerRef = useRef(null);

    const [channel, setChannel] = useState({})

    const {currentUser} = useSelector((state)=>state.user)

    useEffect(() => {
        const handleClickOutside = (e) => {
          if (containerRef.current  && !containerRef.current.contains(e.target)) {
            setShowOption(false);
          }
        };
        document.addEventListener('mousedown', handleClickOutside);
        document.body.style.overflow = 'hidden';
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
          document.body.style.overflow = 'auto';
        };
      }, []);
  return (
    <Container ref={containerRef}>
        <Wrapper>
            {(currentUser._id===video.userId) && <Link to={`/edit/${video._id}`} style={{textDecoration:"none", color:"inherit"}}  >
              <Item >
                  <EditIcon/>
                  Edit
              </Item>
            </Link>}

            <Item >
                <SendIcon/>
                Share
            </Item>
            <Item >
                <PlaylistAddIcon/>
                Add to Playlist
            </Item>
            <Item >
                <ArrowDownwardIcon/>
                Download
            </Item>
            <Hr/>

            {(currentUser._id===video.userId)&&<Item special="true" >
                <DeleteIcon/>
                Delete
            </Item>}
        </Wrapper>
    </Container>
  )
}

export default Option