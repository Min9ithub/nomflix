import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { auth } from "../fbase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  AuthError,
} from "firebase/auth";

const Form = styled.form`
  width: 100%;
  max-width: 320px;
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  max-width: 320px;
  width: 100%;
  padding: 10px;
  border-radius: 30px;
  background-color: rgba(255, 255, 255, 1);
  margin-bottom: 10px;
  font-size: 12px;
  color: black;
`;

const ToggleBtn = styled.span`
  cursor: pointer;
  margin-top: 10px;
  margin-bottom: 50px;
  display: block;
  font-size: 12px;
  text-decoration: underline;
`;

interface IForm {
  keyword: string;
}

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newAccount, setNewAccount] = useState(true);
  const [error, setError] = useState("");
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = event;

    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
  const onValid = async () => {
    let data;
    try {
      if (newAccount) {
        data = await createUserWithEmailAndPassword(auth, email, password);
      } else {
        data = await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (error) {
      setError((error as AuthError).message);
    }
    // navigate("/");
  };

  const toggleAccount = () => setNewAccount((prev) => !prev);
  return (
    <>
      <Form onSubmit={handleSubmit(onValid)}>
        <Input
          name="email"
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={onChange}
        />
        <Input
          name="password"
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={onChange}
        />
        <Input
          type="submit"
          value={newAccount ? "Create Account" : "Sign In"}
          style={{ cursor: "pointer" }}
        />
        {error && <span>{error}</span>}
      </Form>
      <ToggleBtn onClick={toggleAccount}>
        {newAccount ? "Sign In" : "Create Account"}
      </ToggleBtn>
    </>
  );
}

export default LoginForm;
