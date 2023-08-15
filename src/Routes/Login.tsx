import { auth } from "../fbase";
import styled from "styled-components";
import LoginForm from "../Components/LoginForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faGoogle } from "@fortawesome/free-brands-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import {
  AuthError,
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import React, { useState } from "react";

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  justify-content: center;
  align-items: center;
`;

const Btns = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 320px;
`;

const Btn = styled.button`
  cursor: pointer;
  border-radius: 20px;
  border: none;
  padding: 10px 0px;
  font-size: 12px;
  text-align: center;
  width: 150px;
  background: white;
`;

function Login() {
  const [error, setError] = useState("");
  const onSocialClick = async (event: React.MouseEvent) => {
    const { name } = event.target as HTMLInputElement;
    let provider;
    if (name === "google") {
      provider = new GoogleAuthProvider();
    } else if (name === "github") {
      provider = new GithubAuthProvider();
    }
    try {
      if (provider) {
        await signInWithPopup(auth, provider);
      }
    } catch (error) {
      setError((error as AuthError).message);
    }
  };

  return (
    <LoginContainer>
      <LoginForm />
      <Btns>
        <Btn onClick={onSocialClick} name="google">
          Continue with Google <FontAwesomeIcon icon={faGoogle as IconProp} />
        </Btn>
        <Btn onClick={onSocialClick} name="github">
          Continue with Github <FontAwesomeIcon icon={faGithub as IconProp} />
        </Btn>
      </Btns>
      {error && <span>{error}</span>}
    </LoginContainer>
  );
}

export default Login;
