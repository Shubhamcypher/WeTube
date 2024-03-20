import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { format } from 'timeago.js'
import styled from 'styled-components'
import axios from 'axios'

const Container = styled.div`
    width: ${(props)=>props.type !== "sm" && "320px"};
    margin-bottom: ${(props) => (props.type === "sm" ? "15px" : "20px")};
    cursor:pointer;
    border-radius:10px;
    display: ${(props)=>props.type === "sm" && "flex"};
    gap:10px;
    
`

const Image = styled.img`
    width: ${(props) => (props.type === "sm" ? "100%" : "100%")};
    height: ${(props) => (props.type === "sm" ? "100px" : "180px")};
    background-color: #999;
    border-radius:10px;
    &:hover {
        transform: ${(props) => (props.type === "sm" ? "scale(1)" : "scale(1.07)")}
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
`

const Card = ({type,video}) => {

      
  const [channel, setChannel] = useState({})

  useEffect(() => {
    const fetchChannel = async()=>{
      const res = await axios.get(`/api/user/find/${video.userId}`);
      
      setChannel(res.data) ;//this data contains everything that api sends us
    };
    fetchChannel();
  }, [video.userId])
    
  return (
    <Link to={`/video/${video._id}`} style={{textDecoration:"none"}}>
    <Container type={type}>
        <Image type={type} src={video.imgUrl} />
        <Details type={type}> 
            <Link to={`/profile/${video.userId}`} style={{textDecoration:"none"}}>
                <ChannelImage type={type} src={channel.img} />
            </Link>
            <Texts>
                <Link to={`/profile/${video.userId}`} style={{textDecoration:"none"}}>
                    <ChannelName>{channel.name}</ChannelName>
                </Link>
                <Title>{video.title}</Title>
                <Info>{video.views} views • {format(video.createdAt)}</Info>
            </Texts>
        </Details>
    </Container>
    </Link>
  )
}

export default Card