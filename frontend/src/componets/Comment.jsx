import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { format } from "timeago.js";

const Container = styled.div`
  display: flex;
  gap: 10px;
  margin: 30px 0px;
  flex-wrap: wrap;
`;

const CommentWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #999;
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  color: ${({ theme }) => theme.text};
`;
const Name = styled.span`
  font-size: 13px;
  font-weight: 500;
`;

const Date = styled.span`
  font-size: 12px;
  font-weight: 400;
  color: ${({ theme }) => theme.textSoft};
  margin-left: 5px;
`;

const Text = styled.span`
  font-size: 14px;
`;

const InputField = styled.input`
  font-size: 14px;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 100%;
  background-color: transparent;
  outline: none;
  color: ${({ theme }) => theme.text};

`;

const ActionButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
`;

const EditComment = styled.button`
  background-color: transparent;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
  text-decoration: underline;
  border: none;
  border-radius: 10px;
  height: max-content;
  padding: 10px 20px;
  cursor: pointer;
`;

const DeleteComment = styled.button`
  background-color: orange;
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
    background-color: red;
  }
`;

const Comment = ({ comment, comments, setComments }) => {
  const [channel, setChannel] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editedComment, setEditedComment] = useState(comment.desc);

  useEffect(() => {
    const fetchComment = async () => {
      const res = await axios.get(`/api/user/find/${comment.userId}`);
      setChannel(res.data)
    };
    fetchComment();
  }, [comment.userId]);


  const handleEditComment = async () => {
    try {
      
      const res = await axios.put(`/api/comment/${comment._id}`, {
        desc: editedComment,
      });
      
      const updatedComments = comments.map((c) =>
        c._id === comment._id ? { ...c, desc: editedComment } : c
      );
      setComments(updatedComments);
      setIsEditing(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteComment = async () => {
    try {
      await axios.delete(`/api/comment/${comment._id}`);
      const nonDeletedComments = comments.filter((c) => c._id !== comment._id);
      setComments(nonDeletedComments);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Container>
      <CommentWrapper>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <Avatar src={channel.img} />
          <Details>
            <Name>
              {channel.name} <Date>{format(comment.createdAt)}</Date>
            </Name>
            {isEditing ? (
              <InputField
                type="text"
                value={editedComment}
                onChange={(e) => setEditedComment(e.target.value)}
              />
            ) : (
              <Text>{comment.desc}</Text>
            )}
          </Details>
        </div>

        <ActionButtons>
          {isEditing ? (
            <EditComment onClick={handleEditComment}>Save</EditComment>
          ) : (
            <EditComment onClick={() => setIsEditing(true)}>Edit</EditComment>
          )}
          <DeleteComment onClick={handleDeleteComment}>Delete</DeleteComment>
        </ActionButtons>
      </CommentWrapper>
    </Container>
  );
};

export default Comment;
