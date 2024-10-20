import { put } from "redux-saga/effects";
import { setUserData } from "../../store/ducks/user/actionCreators"

import React, { Component } from 'react';
import { UserApi } from "../../services/api/user-service/userApi";
import { TOKEN } from "../../constants/common-constants";
import { Redirect } from 'react-router-dom'

class OAuth2RedirectHandler extends Component {
    getUrlParameter(name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');

        var results = regex.exec(this.props.location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    };

    async componentDidMount() {
        const token = this.getUrlParameter('token');
        localStorage.setItem(TOKEN, token);

        const response = await UserApi.getUserByToken(token);
        put(setUserData(response.data.user));
    }

    render() {        
        const token = this.getUrlParameter('token');
        const error = this.getUrlParameter('error');

        if(token) {
            return (
                <Redirect to={{
                    pathname: "/home",
                    state: { from: this.props.location }
                }}/>
            ); 
        } else {
            return <Redirect to={{
                pathname: "/login",
                state: { 
                    from: this.props.location,
                    error: error 
                }
            }}/>; 
        }
    }
}

export default OAuth2RedirectHandler;