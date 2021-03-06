import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { validateLogin } from "../../utils/registerValidations";
import { postLogin } from "../../utils/login";
import { useDispatch } from "react-redux";
import { setCookie } from "../../redux/actions";
import { GoogleLogin } from "react-google-login";
import axios from "axios";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import ForgotPasswordModal from "./ForgotPasswordModal";
import Typography from "@mui/material/Typography";

import Swal from "sweetalert2";

function Login({ setLogin, setLoginModal, setRegisterModal }) {
  const dispatch = useDispatch();
  const [start, setStart] = useState(true);
  const [inputs, setInputs] = useState({
    username: "",
    password: "",
  });
  const [inputsErrors, setInputErrors] = useState({});
  const [modal, setModal] = useState(false);

  const handleChange = (e) => {
    if (start) {
      setStart(() => false);
    }
    setInputs((prev) => {
      //guard el input modificado
      const input = {
        ...prev,
        [e.target.name]: e.target.value,
      };
      // seteo los errores
      setInputErrors(() => {
        return validateLogin(input);
      });
      // seteo el estado
      return input;
    });
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const { id, token } = await postLogin(inputs);

      setInputs({
        username: "",
        password: "",
      });
      setLoginModal(() => false);
      Swal.fire({
        title: "Logged in!",
        icon: "success",
        confirmButtonText: "OK",
        timer: 3500,
        confirmButtonColor: "green",
      });
      // guardo token en localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("userId", id);
      // configuramos axios
      axios.defaults.headers.common["authorization"] = "Bearer " + token;
      dispatch(setCookie(id));
      setLogin && setLogin(true);
    } catch (e) {
      setInputErrors(() => {
        let error = {};
        const message = e.response.data.message;
        if (e.response && message === "User does not exist") {
          error.username = "User incorrect";
        } else if (message === "Banned user") {
          error.username = "Banned user";
          error.password = "Banned user";
        } else {
          error.password = "Password incorrect";
        }
        return error;
      });
    }
  };
  const handleLogin = async (googleData) => {
    try {
      const token = googleData.tokenId;
      const { data } = await axios.post(`/auth/login?token=${token}`);
      setLoginModal(() => false);
      // guardo token en localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.id);
      // configuramos axios
      axios.defaults.headers.common["authorization"] = "Bearer " + data.token;
      dispatch(setCookie(data.id));
      setLogin && setLogin(true);
    } catch (e) {
      setInputs({
        username: "",
        password: "",
      });
      setInputErrors(() => {
        let obj = {};
        if (e.response.data.message === "Banned user") {
          obj.username = "Banned user";
          obj.password = "Banned user";
        } else {
          obj.username = "Unregistered user";
        }
        return obj;
      });
    }
  };

  const handleCreateAccount = () => {
    setRegisterModal((prev) => !prev);
    setLoginModal((prev) => !prev);
  };

  function handleForgotPassword() {
    setModal(true);
  }

  return (
    <Box sx={{ padding: "5%" }}>
      <Box>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            required
            error={inputsErrors.username ? true : false}
            helperText={inputsErrors.username}
            name="username"
            value={inputs.username}
            label="Username"
            variant="outlined"
            onChange={handleChange}
          />
          <TextField
            fullWidth
            required
            error={inputsErrors.password ? true : false}
            helperText={inputsErrors.password}
            name="password"
            value={inputs.password}
            label="Password"
            type="password"
            variant="outlined"
            onChange={handleChange}
            sx={{ marginTop: "2%" }}
          />

          <Button
            type="submit"
            variant="contained"
            color="secondary"
            disabled={Object.keys(inputsErrors).length ? true : false}
            fullWidth={true}
            sx={{ marginTop: "2%" }}
          >
            Sing in
          </Button>
        </form>
      </Box>

      <Button
        type="submit"
        color="primary"
        onClick={handleForgotPassword}
        underline="always"
        size="small"
        sx={{ marginTop: "2%" }}
      >
        Forgot your password?
      </Button>

      <ForgotPasswordModal
        modal={modal}
        setModal={setModal}
        message={
          "Enter the email address associated with your WebService account"
        }
      />

      <Divider
        sx={{
          width: "100%",
          border: "1px solid rgba(0,0,0,.1)",
          marginBottom: "3%",
        }}
      />

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          // justifyContent: 'space-between',
          justifyContent: "center",
          gap: "1.5rem",
          flexWrap: "wrap",
        }}
        gap={{ xs: 1 }}
      >
        <Typography variant="body2" color="primary">
          New to WebService?
        </Typography>

        <Button
          variant="outlined"
          color="secondary"
          disableElevation
          size="small"
          onClick={handleCreateAccount}
        >
          CREATE ACCOUNT
        </Button>

        <GoogleLogin
          clientId="316128007785-fif02sojlsoinu9s5eugus3qaagiclid.apps.googleusercontent.com"
          buttonText="Log in with Google"
          onSuccess={handleLogin}
          onFailure={inputsErrors.google}
          helperText={inputsErrors.google}
        />
      </Box>
    </Box>
  );
}

export default Login;
