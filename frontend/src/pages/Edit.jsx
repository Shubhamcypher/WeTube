import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import app from '../firebase.js'

const Container = styled.div`
  gap: 24px;
  height: 100vh;
  width: 100%;
`;

const Content = styled.div`
  flex: 5;
  display: flex;
  flex-direction: column;
`;

const Heading = styled.h1`
  font-size:30px;
  color: ${({ theme }) => theme.text};
  margin-bottom: 25px;
`

const ImageWrapper = styled.div`
  display: flex;
  gap: 20px;
  align-items: end;
  margin-bottom: 20px;
  color: ${({ theme }) => theme.text};
`;

const ImageFrame = styled.img`
  max-height: 300px;
  width: 60%;
  object-fit: cover;
  border-radius: 10px;
  overflow: hidden;
`;

const Hr = styled.hr`
  margin: 1px 0px;
  border: 0.5px solid ${({ theme }) => theme.soft};
`;

const Title = styled.h1`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 26px;
  font-weight: 600;
  margin-top: 20px;
  margin-bottom: 10px;
  color: ${({ theme }) => theme.text};
`;
const Info = styled.h3`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
  font-weight: 400;
  margin-top: 20px;
  margin-bottom: 10px;
  color: ${({ theme }) => theme.text};
`;

const Details = styled.div``;

const Description = styled.p`
  font-size: 16px;
  color: ${({ theme }) => theme.text};
`;

const InputField = styled.input`
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.text};
  background-color: transparent;
  outline: none;
  font-size: 18px;
  width: -webkit-fill-available;
`;

const UpdateButton = styled.button`
  background-color: orange;
  font-weight: 700;
  color: white;
  border: none;
  border-radius: 10px;
  height: max-content;
  padding: 10px 14px;
  cursor: pointer;
  font-size: 14px;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.1);
    background-color: #6495ed;
  }
`;

const SubmitContainer = styled.div`
  display: flex;
  width: inherit;
  height: 30px;
  justify-content: center;
  margin-top: 70px;
`;

const SubmitButton = styled.button`
  background-color: #0000cd;
  font-weight: 800;
  color: white;
  font-size: 18px;
  border: none;
  border-radius: 10px;
  height: max-content;
  padding: 15px 20px;
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.1);
    background-color: #3cb371;
    color: black;
  }
`;

const Input = styled.input`
border: 1px solid ${({ theme }) => theme.soft};
color: ${({ theme }) => theme.text};
border-radius: 3px;
padding: 10px;
background-color: transparent;
`;


const Edit = () => {
  const path = useLocation().pathname.split('/')[2];

  const [video, setVideo] = useState({});
  const [editedThumbnail, setEditedThumbnail] = useState('')
  const [editThumbnail, setEditThumbnail] = useState(false)
  const [editedTitle, setEditedTitle] = useState('');
  const [editTitle, setEditTitle] = useState(false);
  const [editedDescription, setEditedDescription] = useState('');
  const [editDescription, setEditDescription] = useState(false);
  const [editedTags, setEditedTags] = useState('');
  const [editTags, setEditTags] = useState(false);

  const [img, setImg] = useState(undefined)
  const [inputs, setInputs] = useState({})
  const [imgPercent, setImgPercent] = useState(0)

  const navigate = useNavigate()

  useEffect(() => {
    const fetchVideo = async () => {
      const res = await axios.get(`/api/video/find/${path}`);
      setVideo(res.data);
      setEditedTitle(res.data.title);
      setEditedDescription(res.data.desc);
      setEditedTags(res.data.tags);
      setEditedThumbnail(res.data.imgUrl)
    };
    fetchVideo();
  }, [path]);

  const handleEditTitle = () => {
    setEditedTitle(video.title);
    setEditTitle(!editTitle);
  };

  const handleSaveTitle = () => {
    setEditTitle(!editTitle);
  };

  const handleEditDescription = () => {
    setEditedDescription(video.desc);
    setEditDescription(!editDescription);
  };

  const handleSaveDescription = () => {
    setEditDescription(!editDescription);
  };

  const handleEditTags = () => {
    setEditedTags(video.tags);
    setEditTags(!editTags);
  };

  const handleSaveTags = () => {
    setEditTags(!editTags);
  };

  const handleEditThumbnail = () => {
    setEditedThumbnail(video.imgUrl);
    setEditThumbnail(!editThumbnail);
  };

  const uploadFile = async (file, urlType)=>{
    const storage = getStorage(app);
    const fileName = new Date().getTime()+file.name
    const storageRef = ref(storage, fileName );

    const uploadTask = uploadBytesResumable(storageRef, file);

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on('state_changed',
    (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImgPercent(Math.round(progress))
        switch (snapshot.state) {
        case 'paused':
            console.log('Upload is paused');
            break;
        case 'running':
            console.log('Upload is running');
            break;
        default:
            break;
        }
        setEditThumbnail(false)
        setEditedThumbnail(inputs)
    },
    (error)=>{},
    () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setInputs((prev) => {
                return { ...prev, [urlType]: downloadURL };
              });
              setEditedThumbnail(downloadURL);
        });
      }
    ); 
}
useEffect(()=>{
    img && uploadFile(img,"imgUrl");
},[img])

const handleSubmit = async()=>{
    try {
        const res = await axios.patch(`/api/video/update/${video._id}`,{
            title: editedTitle,
            imgUrl: editedThumbnail,
            desc: editedDescription,
            tags: editedTags
        })
        setVideo(res.data);
        navigate(`/video/${video._id}`)
    }
     catch (error) {
        
    }
}

  return (
    <Container>
      <Content>
        <Heading>Edit</Heading>
        <ImageWrapper>
          <ImageFrame src={editedThumbnail} />
          <UpdateButton onClick={handleEditThumbnail}>Edit Thumbnail</UpdateButton>
          {editThumbnail && <Input type='file' accept='image/*' onChange={(e)=>setImg(e.target.files[0])}/>}
          {(imgPercent>0 && imgPercent<100) && ("Uploading: "+ imgPercent+ "%")}
          <div style={{color:'green'}}>
          {imgPercent==100 && ("Uploaded!")}
          </div>
        </ImageWrapper>
        <Hr />
        {editTitle ? (
          <Title>
            <InputField
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
            />
            <UpdateButton onClick={handleSaveTitle}>Save Title</UpdateButton>
          </Title>
        ) : (
          <Title>
            {editedTitle}
            <UpdateButton onClick={handleEditTitle}>Edit Title</UpdateButton>
          </Title>
        )}
        <Hr />
        <Details>
          <Description>
            {editDescription ? (
              <Info>
                <InputField
                  type="text"
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                />
                <UpdateButton onClick={handleSaveDescription}>Save Desc</UpdateButton>
              </Info>
            ) : (
              <Info>
                {editedDescription}
                <UpdateButton onClick={handleEditDescription}>Edit Desc</UpdateButton>
              </Info>
            )}
            <Hr />
            {editTags ? (
              <Info>
                <InputField
                  type="text"
                  value={editedTags}
                  onChange={(e) => setEditedTags(e.target.value)}
                />
                <UpdateButton onClick={handleSaveTags}>Save Tags</UpdateButton>
              </Info>
            ) : (
              <Info>
                {editedTags}
                <UpdateButton onClick={handleEditTags}>Edit Tags</UpdateButton>
              </Info>
            )}
            <Hr />
          </Description>
        </Details>
        <SubmitContainer>
          <SubmitButton onClick={handleSubmit}>Update</SubmitButton>
        </SubmitContainer>
      </Content>
    </Container>
  );
};

export default Edit;
