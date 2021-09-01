import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Header from './Header';
import Header2 from './Header2';
import List from './List/List'

function Board(props) {
    let history = useHistory();
    useEffect(() =>{
        const token = localStorage.getItem("TOKEN");
        if(token == null){
            history.push("/")
        }
    },[])
    return (
        <div>
            <Header />
            <Header2 id={props.match.params.id}/>
            <List id = {props.match.params.id}/>
        </div>
    );
}

export default Board;