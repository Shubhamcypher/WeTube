import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import Card from '../componets/card/Card.jsx'
import axios from 'axios'

const Container = styled.div`
    display: flex;
    gap:30px;
    flex-wrap: wrap;
    
`

const Home = ({type}) => {
  
  const [videos, setVideos] = useState([])

  useEffect(() => {
    
    const fetchVideos = async()=>{
      const res = await axios.get(`/api/video/${type}`);
      
      setVideos(res.data) ;//this data contains everything that api sends us
    };
    fetchVideos();
  }, [type,])
  
  return (
    <Container>
        
        {videos.map((video)=>(
          <Card key={video._id} video={video}/>
        ))}
    </Container>
  )
}

export default Home