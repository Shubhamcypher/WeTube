import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { format } from 'timeago.js'
import styled from 'styled-components'
import axios from 'axios'

import Option from '../Option'

import MoreVertIcon from '@mui/icons-material/MoreVert';

const Container = styled.div`
    width: ${(props)=>props.type !== "sm" && "320px"};
    margin-bottom: ${(props) => (props.type === "sm" ? "15px" : "20px")};
    border-radius:10px;
    display: ${(props)=>props.type === "sm" && "flex"};
    gap:10px;    
`

const Image = styled.img`
    width: ${(props) => (props.type === "sm" ? "180px" : "100%")};
    cursor:pointer;
    height: ${(props) => (props.type === "sm" ? "120px" : "180px")};
    background-color: #999;
    border-radius:10px;
    object-fit: cover;
    &:hover {
        transform: ${(props) => (props.type === "sm" ? "scale(1)" : "scale(1.07)")};
        box-shadow: 2px 2px 8px 1px #ff4f00;
      }
    
`


const Details = styled.div`
    display:flex;
    margin-top: ${(props)=>props.type !== "sm" && "16px"};
    gap:12px;    
`

const ChannelImage = styled.img`
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background-color: #999;
    display: ${(props)=>props.type === "sm" && "none"};
`

const Texts = styled.div`
  
    
`
const Title = styled.h1`
    font-size: 16px;
    font-weight: 500;
    color:${({theme})=>theme.text};
    width: 10%;
    display: inline;
`
const ChannelName = styled.h2`
    font-size: 16px;
    color:${({theme})=>theme.textSoft};
    margin: 9px 0px;
`
const Info = styled.div`
    font-size: 16px;
    color:${({theme})=>theme.textSoft};
    display: inline;
`

const OptionIcon = styled.div`
      height:25px;
      width:25px;
      color:${({theme})=>theme.textSoft};
      margin-left: 70px;
      cursor: pointer;
      padding:2.5px;
      display: ${(props)=>props.type === "sm" && "none"};

      &:hover {
        background-color: ${({ theme }) => theme.soft};
        border-radius : 50%;
      }

`

const Card = ({type,video}) => {

      
  const [channel, setChannel] = useState({})

  const [showOption, setShowOption] = useState(false);

  useEffect(() => {
    const fetchChannel = async()=>{
      const res = await axios.get(`/api/user/find/${video.userId}`);
      
      setChannel(res.data) ;//this data contains everything that api sends us
    };
    fetchChannel();
  }, [video.userId]);

  const handleCard = async()=>{
    try {
        await axios.put(`/api/video/views/${video._id}`)

    } catch (error) {
        console.log(error);
    }
  }
    
  return (
      <Container type={type} onClick={handleCard}>
        <Link to={`/video/${video._id}`} style={{textDecoration:"none"}}>
        <Image type={type} src={video.imgUrl} />
        </Link>
        <Details type={type}> 
            <Link to={`/profile/${video.userId}`} style={{textDecoration:"none"}}>
                <ChannelImage type={type} src={channel.img} />
            </Link>
            <Texts>
                <Link to={`/video/${video._id}`} style={{textDecoration:"none"}}>
                <Title>{video.title}</Title>
                </Link>
                <Link to={`/profile/${video.userId}`} style={{textDecoration:"none"}}>
                    <ChannelName>{channel.name}</ChannelName>
                </Link>
                <Info>{video.views} views • {format(video.createdAt)}</Info>
            </Texts>
            <OptionIcon type={type} onClick={()=>{setShowOption(!showOption)} }>
                <MoreVertIcon />
            </OptionIcon>
            {showOption && <Option setShowOption={setShowOption}/>}
        </Details>
    </Container>
  )
}

export default Card