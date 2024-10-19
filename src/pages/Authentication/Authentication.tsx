import React, { FC, ReactElement } from "react";
import { useHistory } from "react-router-dom";
import TwitterIcon from "@material-ui/icons/Twitter";
import { Button, List, ListItem, Typography, Divider, Box } from "@material-ui/core";
import { useDispatch } from "react-redux" ;
import { useState } from 'react';
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";

import { useAuthenticationStyles } from "./AuthenticationStyles";
import { CommunityIcon, ReplyIcon, SearchIcon } from "../../icons";
import RegistrationModal from "./RegistrationModal/RegistrationModal";
import CustomizeModal from "./CustomizeModal/CustomizeModal";
import CreateAccountModal from "./CreateAccountModal/CreateAccountModal";
import EmailVerificationModal from "./EmailVerificationModal/EmailVerificationModal";
import SetPasswordModal from "./SetPasswordModal/SetPasswordModal";
import { ACCOUNT_LOGIN } from "../../constants/path-constants";
import { setOpenModal } from "../../store/ducks/authentication/actionCreators";

const Authentication: FC = (): ReactElement => {
    const classes = useAuthenticationStyles();
    const dispatch = useDispatch();
    const history = useHistory();
    const [state, setState] = useState();

    const handleClickOpenSignIn = (): void => {
        history.push(ACCOUNT_LOGIN);
    };

    const handleClickOpenSignUp = (): void => {
        dispatch(setOpenModal());
    };

//     const login = useGoogleLogin({
// //         onSuccess: codeResponse => handleGoogleSuccess(codeResponse),
// //         onError: (res) => handleGoogleFailure(res),
// //         ux_mode: 'redirect',
//         // redirect_uri: "http://localhost:3000",
//         // redirect_uri: "https://ms-api-gateway-inku.onrender.com/ui/v1/auth/login/oauth2/code/google",
//         // redirect_uri: "http://localhost:8443/ms-user-service/ui/v1/auth/login/oauth2/code/google",
// //         flow: 'auth-code',
//       });
//
      const login = useGoogleLogin({
        ux_mode: "redirect",
        state: '<state>',
        redirect_uri: "http://localhost:8443/ms-user-service/login/oauth2/code/google",
        flow: "auth-code",
        scope: "https://www.googleapis.com/auth/drive.readonly",
        onSuccess: (codeResponse) => console.log('Login OK so far'),
        onError: (error) => console.log('Login Failed:', error)
      });

    const handleGoogleSuccess = (response: any) => {
        console.log('Login Success:', response);
        const idToken = response.credential; // Note: Change from tokenId to credential
      
        // Pass the ID token to your backend service
        fetch('https://ms-api-gateway-inku.onrender.com/ui/v1/auth/login/oauth2/code/google', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ idToken }),
        })
        .then(response => response.json())
        .then(data => {
          console.log('User logged in or registered:', data);
        })
        .catch(error => {
          console.error('Error logging in or registering user:', error);
        });
    };

    const handleGoogleFailure = (response: any) => {
        console.log('Google Login Failure:', response);
        // Handle Google login failure
    };

    const handleFacebookResponse = (response: any) => {
        console.log('Facebook Login Response:', response);
        // Handle Facebook login response
    };

    return (
        <div className={classes.wrapper}>
            <section className={classes.leftSide}>
                <TwitterIcon color="primary" className={classes.leftSideTwitterIcon} />
                <List className={classes.leftSideListInfo}>
                    <ListItem>
                        <Typography variant="h6">
                            <>{SearchIcon}</>
                            Follow your interests.
                        </Typography>
                    </ListItem>
                    <ListItem>
                        <Typography variant="h6">
                            <>{CommunityIcon}</>
                            Hear what people are talking about.
                        </Typography>
                    </ListItem>
                    <ListItem>
                        <Typography variant="h6">
                            <>{ReplyIcon}</>
                            Join the conversation.
                        </Typography>
                    </ListItem>
                </List>
            </section>
            <section className={classes.rightSide}>
                <div className={classes.rightSideWrapper}>
                    <TwitterIcon color="primary" className={classes.rightSideTwitterIcon} />
                    <Typography className={classes.rightSideTittle} variant="h4">
                        See what's happening in the world right now
                    </Typography>
                    <Typography>
                        <b>Join Twitter today!</b>
                    </Typography>
                    <br />
                    <Button
                        className={classes.button}
                        onClick={handleClickOpenSignUp}
                        variant="contained"
                        color="primary"
                        size="large"
                        fullWidth
                    >
                        Sign up
                    </Button>
                    <Button
                        className={classes.button}
                        onClick={handleClickOpenSignIn}
                        variant="outlined"
                        color="primary"
                        size="large"
                        fullWidth
                    >
                        Log in
                    </Button>
                    <div className={classes.dividerContainer}>
                        <Divider className={classes.divider} />
                        <Typography variant="caption" className={classes.dividerText}> or </Typography>
                        <Divider className={classes.divider} />
                    </div>
                    <div>
                    <Button
                        onClick={() => {
                            login()
                        }}
                        className={classes.btnGoogle}
                        variant="outlined"
                        color="primary"
                        size="medium"
                        fullWidth
                    >
                        <img src={`${process.env.PUBLIC_URL}/google-icon.png`} alt="Google logo" />
                        Sign in with Google
                    </Button>    
                    </div>
                    <FacebookLogin
                        appId="your-facebook-app-id"
                        fields="name,email,picture"
                        callback={handleFacebookResponse}
                        render={renderProps => (
                            <Button
                            onClick={renderProps.onClick}
                            className={classes.btnFacebook}
                            variant="outlined"
                            color="primary"
                            size="large"
                            fullWidth
                        >
                            <img src={`${process.env.PUBLIC_URL}/facebook-icon.png`} alt="Facebook logo" />
                            Sign in with Facebook
                        </Button>    
                        )}
                    />
                    <RegistrationModal />
                    <CustomizeModal />
                    <CreateAccountModal />
                    <EmailVerificationModal />
                    <SetPasswordModal />
                </div>
            </section>
        </div>
    );
};

export default Authentication;
