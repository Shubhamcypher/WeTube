import styled, { ThemeProvider } from "styled-components";
import Menu from "./componets/Menu.jsx";
import Navbar from "./componets/Navbar.jsx";
import { darkTheme, lightTheme } from "./utils/Theme";
import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Video from "./pages/Video.jsx";
import Signin from "./pages/Signin.jsx";
import Search from "./componets/Search.jsx";
import Menu2 from "./componets/Menu2.jsx";
import Profile from "./pages/Profile.jsx";
import Edit from "./pages/Edit.jsx";

import axios from "axios";

axios.defaults.baseURL = 'https://server-rwug.onrender.com'

const Container = styled.div`
  display : flex;  
  
`
const Main = styled.div`
  flex:7;
  background-color: ${({theme})=>theme.bg};
`
const Wrapper = styled.div`
  padding: 30px 80px;
`

const App = ()=>{

  const [darkMode, setDarkMode] = useState(true)
  const [showMenu, setShowMenu] = useState(true)
  
  return (
    <ThemeProvider theme={darkMode?darkTheme:lightTheme}>
        <Container>
          <BrowserRouter>
          {showMenu
          ?(<Menu darkMode={darkMode} setDarkMode={setDarkMode} setShowMenu={setShowMenu} showMenu={showMenu} />)
          :(<Menu2 showMenu={showMenu} setShowMenu={setShowMenu}/>)}
          <Main>
            <Navbar darkMode={darkMode} setDarkMode={setDarkMode}/>
            <Wrapper>
            <Routes>
                <Route path="/">
                  <Route index element={<Home type= 'random' />} />
                  <Route path="trending" element={<Home type= 'trending' />} />
                  <Route path="subscriptions" element={<Home type= '/subscribed' />} />
                  <Route path="search" element={<Search type= '/search' />} />
        
                  <Route path="signin" element={<Signin />} />
       
                  <Route path="video">
                    <Route path=":id" element={<Video />} />
                  </Route>

                  <Route path="profile"  >
                    <Route path=":id" element={<Profile />} />
                  </Route>

                  <Route path="edit"  >
                    <Route path=":id" element={<Edit />} />
                  </Route>

                </Route>
              </Routes>
            </Wrapper>
          </Main>
          </BrowserRouter>
        </Container>
    </ThemeProvider>
  )
}

export default App;
