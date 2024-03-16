import React, { useEffect, useState } from 'react'

import styled from 'styled-components'

import Commment from './Comment.jsx'
import Comment from './Comment.jsx'
import axios from 'axios'
import { useSelector } from 'react-redux'

const Container = styled.div`

`
const NewComment = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`
const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`
const Input = styled.input`
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.text};
  background-color: transparent;
  outline: none;
  padding: 5px;
  width: 100%;
`;

const PostButton = styled.button`
background-color: #4169e1;
font-weight: 500;
color: white;
border: none;
border-radius: 10px;
height: max-content;
padding: 10px 20px;
cursor: pointer;
transition: transform 0.3s ease; 

  &:hover {
    transform: scale(1.1);
  }
}
`;
const ClearPostButton = styled.button`
background-color: grey;
font-weight: 500;
color: white;
border: none;
border-radius: 10px;
height: max-content;
padding: 10px 20px;
cursor: pointer;
transition: transform 0.3s ease; 

  &:hover {
    transform: scale(1.1);
  }
}
`;

const Comments = ({videoId}) => {
  const [comments, setComments] = useState([])
  const {currentUser} = useSelector((state)=>state.user)
  const [newComment, setNewComment] = useState('')

  
  const handlePostComment = async () => {
    try {
      const res = await axios.post('/api/comment/', {
        videoId: videoId,
        desc: newComment,
        userId: currentUser._id, // currentUser has _id field
      });
      setComments([...comments, res.data]); // Add the new comment to the existing comments array
      setNewComment(''); // Clear the input field after posting the comment
    } catch (error) {
      console.log(error);
    }
  };


  useEffect(()=>{
    const fetchComments = async()=>{
      try {
        const res = await axios.get(`/api/comment/${videoId}`)
        console.log(res);
        setComments(res.data)
      } 
      catch (error) {
        console.log(error);
      }
    }
    fetchComments()
  },[videoId])

  return (
    <Container>

        <NewComment>
            <Avatar src={currentUser?.img}/>
            <Input placeholder='Add a comment...' onChange={(e)=>setNewComment(e.target.value)} value={newComment}/>
            <PostButton onClick={handlePostComment}>Comment</PostButton>
            <ClearPostButton onClick={()=>setNewComment("")}>Clear</ClearPostButton>
        </NewComment>

        {comments.slice().reverse().map(comment=>(
          <Comment key={comment._id} comment={comment} comments={comments} setComments={setComments}/>
        ))} 
    </Container>
  )
}

export default Comments;