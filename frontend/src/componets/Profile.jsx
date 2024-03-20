import axios from 'axios';
import React, { useEffect, useState } from 'react'
import styled from 'styled-components';
import Card from './card/Card';
import { useLocation } from 'react-router-dom';

const Container = styled.div`
  gap: 24px;
  flex-direction: column;
`;
const Content = styled.div`
  flex: 5;
`;

const Title = styled.h1`
font-size: 18px;
font-weight: 400;
margin-top: 20px;
margin-bottom: 10px;
color: ${({ theme }) => theme.text};
`
const Details = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`
const Hr = styled.hr`
  margin: 15px 0px;
  border: 0.5px solid ${({ theme }) => theme.soft};
`;

const Info = styled.div`
  color: ${({ theme }) => theme.text};
`

const Channel = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction:column;
`
const ChannelInfo = styled.div`
  
`
const Image = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #999;
  width: 150px;
  height: 150px;
`


const ChannelDetail = styled.div`
  display: flex;
  flex-direction: column;
  color: ${({ theme }) => theme.text};
  padding:25px;
`
const ChannelName = styled.span`
 font-weight: 500;
`
const ChannelCounter = styled.span`
  margin-top: 5px;
  margin-bottom: 20px;
  color: ${({ theme }) => theme.textSoft};
  font-size: 12px;
`
const Description = styled.p`
  font-size: 14px;
`;
const VideoWrapper = styled.div`
display:flex;
flex-direction:row;
flex-wrap: wrap;
gap:40px;
padding: 18px 22px;
`
const Subscribe = styled.button`
  background-color: #cc1a00;
  font-weight: 500;
  color: white;
  border: none;
  border-radius: 3px;
  height: max-content;
  padding: 10px 20px;
  cursor: pointer;
  width:fit-content;
  margin-bottom:10px;
`


const Profile = () => {

    const[currentChannel,setCurrentChannel] = useState({})
    const[currentChannelVideos,setCurrentChannelVideos] = useState([])

    const path = useLocation().pathname.split('/')[2]

    useEffect(()=>{
        const fetchChannel = async ()=>{
            const channelRes = await axios.get(`/api/user/find/${path}`)
            setCurrentChannel(channelRes.data)
            console.log(currentChannel);
        }
        fetchChannel()
    },[path])

    useEffect(()=>{
        const fetchVideo = async ()=>{
            const channelRes = await axios.get(`/api/video/trending`)
            setCurrentChannelVideos(channelRes.data)
        }
        fetchVideo()
    },[])



  return (
    <Container>
        <Content>  
            <Channel>
            <ChannelInfo>
                <Image src= {currentChannel.img}/>
                <ChannelDetail>
                <ChannelName>{currentChannel.name}</ChannelName>
                <ChannelCounter>{currentChannel.subscribers} subscribers</ChannelCounter>
                <Subscribe>
                Subscriibe
                </Subscribe>
                <Description>This is the description of the channel</Description>
                
                </ChannelDetail>
            </ChannelInfo>
            <Hr/>
            <VideoWrapper>
            {currentChannelVideos
            .filter((video) => video.userId === currentChannel._id)
            .map((video) => (
                <Card key={video._id} video={video}/>
             ))}
            </VideoWrapper>
            </Channel>
        </Content>
    </Container>
  )
}

export default Profile