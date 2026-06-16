import { useState } from "react";
import api from "../api/api";

export default function Register() {

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  async function handleRegister(
    e
  ) {

    e.preventDefault();

    try {

      await api.post(
        "/auth/signup",
        {
          email,
          password
        }
      );

      alert(
        "Registration Successful"
      );

      window.location.href = "/";

    } catch (error) {

      console.error(error);

      alert(
        "Registration Failed"
      );
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <form
        onSubmit={
          handleRegister
        }
        style={{
          width: "350px",
          display: "flex",
          flexDirection: "column",
          gap: "15px"
        }}
      >
        <h1>
          Register
        </h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(
              e.target.value
            )
          }
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }
        />

        <button type="submit">
          Register
        </button>
      </form>
    </div>
  );
}