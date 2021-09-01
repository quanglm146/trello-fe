import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Board from '../pages/Board';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import OAuth2RedirectHandler from '../oauth2/OAuth2RedirectHandler';
import NotFound from '../pages/common/NotFound';
import { testApi } from '../Api/func/user';


function HomeUrl() {
    const [authenticated, setAuthenticated] = useState(false);
    const getUserInfor = async ()=>{
        const res=await testApi({
        });
        if(res.data != null){
            setAuthenticated(true)
        }
    }

    useEffect(()=>{
        getUserInfor()
    }, [])
    return (
        <BrowserRouter>
            <Switch >
                <Route exact path="/" render={()=><Login auth={authenticated} />}></Route>
                <Route exact path="/register" component={Register}></Route>
                <Route exact path="/home/"   component={Home}></Route>
                <Route path="/oauth2/redirect" component={OAuth2RedirectHandler}></Route>
                <Route exact path="/board/:id" component={Board}></Route>
                <Route component={NotFound}></Route>
            </Switch>
        </BrowserRouter>
    );
}


export default HomeUrl;