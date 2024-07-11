import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { Link } from 'react-router-dom';

import {  useSelector } from 'react-redux';
import Delete from './Delete.jsx';
import Share from './Share.jsx';

const Container = styled.div`
    position: absolute;
`
const Wrapper = styled.div`
    position:fixed;
    width:160px;
    bottom: 250px;
    color: ${({ theme }) => theme.text};
    border-radius:10px;
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

    const [deleteMenu, setDeleteMenu] = useState(false)
    const [share, setShare] = useState(false)

    const {currentUser} = useSelector((state)=>state.user)

    useEffect(() => {
        const handleClickOutside = (e) => {
          if (containerRef.current  && !containerRef.current.contains(e.target)) {
            setShowOption(false);
          }
        };
        document.addEventListener('mousedown', handleClickOutside);
        document.body.style.overflow = 'auto';
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
          document.body.style.overflow = 'auto';
        };
      }, []);

      const handleDeleteOption = ()=>{
        setDeleteMenu(!deleteMenu);
        // setShowOption(false);
      }

      const handleDownload = () => {
        const videoUrl = video.videoUrl;
        const a = document.createElement('a');
        a.href = videoUrl;
        a.download = 'video.mp4';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      };

      const handleShare = ()=> {
        setShare(!share)
      }

  return (
    <Container ref={containerRef}>
        <Wrapper>
            {(currentUser && (currentUser._id===video.userId)) && <Link to={`/edit/${video._id}`} style={{textDecoration:"none", color:"inherit"}}  >
              <Item >
                  <EditIcon/>
                  Edit
              </Item>
            </Link>}

            <Item onClick={handleShare} >
                <SendIcon/>
                Share
            </Item>
            {currentUser &&
              <Item >
              <PlaylistAddIcon/>
              Add to Playlist
            </Item>
            }

            {currentUser &&
            <Item onClick={handleDownload}>
            <ArrowDownwardIcon/>
            Download
            </Item>}
            <Hr/>

            {currentUser&&(currentUser._id===video.userId)&&
            (<Item special="true" onClick={handleDeleteOption}>
                <DeleteIcon/>
                Delete
            </Item>)}
        </Wrapper>
        {deleteMenu && <Delete setShowOption={setShowOption} setDeleteMenu={setDeleteMenu} video={video}/>}
        {share && <Share video={video}/>}
    </Container>
  )
}

export default Option