import axios from 'axios'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import Card from './card/Card'

const Container = styled.div`
    flex:2;
`;

const Recommendation = ({tags}) => {
    const [videos, setVideos] = useState([])

    useEffect(()=>{
        try {
            const fetchVideos = async ()=>{
                const res = await axios.get(`/api/video/tags?tags=${tags}`)
                setVideos(res.data)
            }
            fetchVideos()
        } 
        catch (error) {
            console.log(error);
        }
    },[tags])
  return (
    <Container>
        {videos.map((video)=>(
            <Card type="sm" key={video._id} video={video}/>
        ))}
    </Container>
  )
}

export default Recommendation