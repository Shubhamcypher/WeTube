import axios from 'axios'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import Card from './card/Card'
import { useLocation } from 'react-router-dom'

const Container = styled.div`
    display: flex;
    gap:40px;
    flex-wrap: wrap;
    
`

const Search = () => {
    const [videos, setVideos] = useState([])
    const query = useLocation().search

    useEffect(()=>{
        const fetchVideos = async()=>{
            const res = await axios.get(`/api/video/search${query}`)
            setVideos(res.data)
        }
        fetchVideos()
    },[query])
  return (
    <Container>
        {videos.map((video)=>(
            <Card key={videos._id} video={video}/>
        ))}
    </Container>
  )
}

export default Search