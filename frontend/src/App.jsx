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

const Container = styled.div`
  display : flex
  
`
const Main = styled.div`
  flex:7;
  background-color: ${({theme})=>theme.bg};
`
const Wrapper = styled.div`
  padding: 22px 96px;
`

const App = ()=>{

  const [darkMode, setDarkMode] = useState(true)
  
  return (
    <ThemeProvider theme={darkMode?darkTheme:lightTheme}>
        <Container>
          <BrowserRouter>
          <Menu darkMode={darkMode} setDarkMode={setDarkMode} />
          <Main>
            <Navbar/>
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
