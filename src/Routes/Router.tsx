import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from '../Components/Header'
import Home from './Home'
import Login from './Login'
import Search from './Search'
import Tv from './Tv'
import { useState } from 'react'

interface AppRouterProps {
    isLoggedIn: boolean
    userObj: any
}

const AppRouter: React.FC<AppRouterProps> = ({ isLoggedIn, userObj }) => {
    return (
        <Router basename={process.env.PUBLIC_URL}>
            <Header />
            <Routes>
                <Route path="/" element={<Home />}>
                    <Route path="/movie/:type/:movieId" element={<Home />} />
                </Route>
                <Route path="/tv" element={<Tv />}>
                    <Route path="/tv/:type/:tvId" element={<Tv />} />
                </Route>
                <Route path="/search" element={<Search />} />
                <Route path="/login" element={<Login />} />
            </Routes>
        </Router>
    )
}

export default AppRouter
