import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbDownOffAltOutlinedIcon from "@mui/icons-material/ThumbDownOffAltOutlined";
import ShareIcon from '@mui/icons-material/Share';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import SaveIcon from '@mui/icons-material/Save';

import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { dislike, fetchSuccess, like } from '../redux/videoSlice.js';
import { format } from 'timeago.js';
import { subscription } from '../redux/userSlice.js';
import Recommendation from '../componets/Recommendation.jsx';
import Comments from '../componets/Comments';
import Share from '../componets/Share.jsx';



const Container = styled.div`
  display: flex;
  gap: 24px;
  z-index:999;
  height:100%;

  @media (max-width: 720px) { 
    flex-direction: column;
}
`
const Content = styled.div`
  flex: 4;
`
const VideoWrapper = styled.div`
`
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

  @media (max-width: 720px) { 
    flex-direction: column;
    align-items: flex-start;
    gap:35px;
}
`
const Hr = styled.hr`
  margin: 15px 0px;
  border: 0.5px solid ${({ theme }) => theme.soft};
`;

const Info = styled.div`
  color: ${({ theme }) => theme.text};
`
const Buttons = styled.div`
  display: flex;
  gap: 20px;
  color: ${({ theme }) => theme.text};
`
const Button = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
`

const Channel = styled.div`
  display: flex;
  justify-content: space-between;
`
const ChannelInfo = styled.div`
  
`
const Image = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #999;
`


const ChannelDetail = styled.div`
  display: flex;
  flex-direction: column;
  color: ${({ theme }) => theme.text};
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
  color: ${({ theme }) => theme.text};
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
`
const VideoFrame = styled.video`
  max-height: 480px;
  width: 100%;
  object-fit: cover;
  border-radius: 10px;
  overflow: hidden;
`;

const Video = () => {
  const {currentUser} = useSelector((state)=>state.user)
  const {currentVideo} = useSelector(state=>state.video)
  

  const dispatch = useDispatch()

  const path = useLocation().pathname.split('/')[2]

  
  

  const [channel,setChannel] = useState({})
  const [openShare, setOpenShare] = useState(false)
  const [loginNavigator, setLoginNavigator] = useState(false)


  const handleLike = async()=>{
    await axios.put(`/user/like/${currentVideo._id}`)
    dispatch(like(currentUser._id))
  }
  const handleDislike = async()=>{
    await axios.put(`/user/dislike/${currentVideo._id}`)
    dispatch(dislike(currentUser._id))
  }



  const handleSave = () => {
    const videoUrl = currentVideo.videoUrl;
    const a = document.createElement('a');
    a.href = videoUrl;
    a.download = 'video.mp4';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  useEffect(()=>{
    const fetchData = async ()=>{
      try {
        const videoRes = await axios.get(`/video/find/${path}`)
        const channelRes = await axios.get(`/user/find/${videoRes.data.userId}`)


        setChannel(channelRes.data)
        dispatch(fetchSuccess(videoRes.data))
      }
       catch (error) {
        console.log(error);
      }
    }
    fetchData();
  },[path,dispatch,channel])
  

  const handleSub = async () => {
    if (currentUser) {
      currentUser.subscribedUsers.includes(channel._id)
      ? await axios.put(`/user/unsub/${channel._id}`)
      : await axios.put(`/user/sub/${channel._id}`);
      dispatch(subscription(channel._id));
    }
    else{
      alert("Please Login to use this feature")
      setLoginNavigator(true)
    }
  };


  return (
    <Container>
      <Content>
        <VideoWrapper>
        <VideoFrame src={currentVideo.videoUrl} autoPlay muted controls allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen/>
        </VideoWrapper>
        <Title>{currentVideo.title}</Title>
        <Details>
        <Info>{currentVideo.views} views • {format(currentVideo.createdAt)}</Info>
        <Buttons>
              <Button onClick={handleLike}>
                {currentVideo.likes?.includes(currentUser?._id)?<ThumbUpIcon/> :<ThumbUpOutlinedIcon />} {currentVideo.likes?.length}
              </Button>

              <Button onClick={handleDislike}>
              {currentVideo.dislikes?.includes(currentUser?._id)?<ThumbDownIcon/> :<ThumbDownOffAltOutlinedIcon />}Dislike
              </Button>
              <Button onClick={()=>setOpenShare(!openShare)}>
                <ShareIcon /> Share
              </Button>
              <Button>
                <SaveIcon  onClick={handleSave}/> Save
              </Button>
        </Buttons>
        </Details>
        <Hr/>

        <Channel>
          <ChannelInfo>
            <Link to={`/profile/${currentVideo.userId}`} style={{textDecoration:"none"}}>
            {channel?<Image src={channel?.img}/>:<Image src="https://yt3.ggpht.com/a/AATXAJyoQKeFnPY6bJ-BPDeFFQ7C8EXN7xuyOSJoDw=s900-c-k-c0xffffffff-no-rj-mo"/>}
            <ChannelDetail>
              {channel?<ChannelName>{channel?.name}</ChannelName>:<ChannelName>Deleted User</ChannelName>}
              <ChannelCounter>{channel?.subscribers} subscribers</ChannelCounter>
            </ChannelDetail>
            </Link>
              <Description>{currentVideo.desc}</Description>
          </ChannelInfo>
          {channel && 
          (<Subscribe onClick={handleSub} style={{backgroundColor:currentUser?.subscribedUsers?.includes(channel?._id)&&"grey"}}>
          {currentUser?.subscribedUsers?.includes(channel?._id)
            ? "SUBSCRIBED"
            : "SUBSCRIBE"}
        </Subscribe>)}
        </Channel>
        <Hr/>
        {channel && <Comments videoId={currentVideo._id} setLoginNavigator={setLoginNavigator} loginNavigator={loginNavigator}/>}
      </Content>
      <Recommendation tags={currentVideo.tags}/>

      {openShare && <Share setOpenShare={setOpenShare}/>}
    </Container>
  )
}

export default Video