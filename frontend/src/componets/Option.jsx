import React, { useEffect, useRef } from 'react'
import styled from 'styled-components'

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const Container = styled.div`
    position: absolute;
`
const Wrapper = styled.div`
    position:relative;
    width:100px;
    top:30px;
    left:220px;
    color: ${({ theme }) => theme.text};
    border-radius:10px;
    // background-color: #FF9933;
    // background-color: transparent;
    background-color: ${({ theme }) => theme.soft};
    padding: 5px;
    

`
const Item = styled.div`
    display:flex;
    padding:5px;
    align-items:center;
    border-radius:5px;
    cursor: pointer;
    &:hover {
        background-color: ${({ theme }) => theme.bgLighter};
        color: ${(props)=>props.special?"red":"#336BFF"};
      }
`

const Hr = styled.hr`
  border: 0.5px solid ${({ theme }) => theme.light};
  margin: 2px;
`;

const Option = ({setShowOption}) => {
    const containerRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
          if (containerRef.current  && !containerRef.current.contains(e.target)) {
            setShowOption(false);
          }
        };
        document.addEventListener('mousedown', handleClickOutside);
        document.body.style.overflow = 'hidden';
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
          document.body.style.overflow = 'auto';
        };
      }, []);
  return (
    <Container ref={containerRef}>
        <Wrapper>
            <Item >
                <EditIcon/>
                Edit
            </Item>
            <Hr/>
            <Item special>
                <DeleteIcon/>
                Delete
            </Item>
        </Wrapper>
    </Container>
  )
}

export default Option