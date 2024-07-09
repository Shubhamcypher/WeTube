import axios from 'axios'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import Card from './card/Card'

const Container = styled.div`
    flex:2;
    overflow-y: auto;
    max-height: 100vh;
    
    &::-webkit-scrollbar {
        width: 1px; /* Width of vertical scrollbar */
    }
    &::-webkit-scrollbar-track {
        background: ${({ theme }) => theme.bgLighter}; /* Color of the track */
    }
    &::-webkit-scrollbar-thumb {
        background: transparent; /* Color of the thumb */
        border-radius: 5px; /* Rounded corners */
    }
    &::-webkit-scrollbar-thumb:hover {
        background: ${({ theme }) => theme.soft}; /* Color of the thumb on hover */
    }
`;

const Recommendation = ({tags}) => {
    const [videos, setVideos] = useState([])

    useEffect(()=>{
        try {
            const fetchVideos = async ()=>{
                const res = await axios.get(`/video/tags?tags=${tags}`)
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