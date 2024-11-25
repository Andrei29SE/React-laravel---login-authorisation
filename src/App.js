import "./App.css"
import axios from "axios"
import { useState } from "react"
import { useForm } from "react-hook-form"

// TEST USER
// Email: test@example.com
// Password: Password123

function App() {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({ mode: "onChange" })

  const watchEmail = watch("email", " ")
  const watchPassword = watch("password", " ")

  // E-mail
  const emailRegexp = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/
  const emailConditions = {
    containsAt: watchEmail.includes("@"),
    validDomain: emailRegexp.test(watchEmail),
  }

  // Password
  const passwordConditions = {
    containsUpperCase: /[A-Z]/.test(watchPassword),
    containsLowerCase: /[a-z]/.test(watchPassword),
    containsDigit: /\d/.test(watchPassword),
  }

  const [token, setToken] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const API_LOGIN_URL = "http://127.0.0.1:8000/api/login"

  // Fetch
  const onSubmit = async (data) => {
    try {
      const response = await axios.post(API_LOGIN_URL, data)
      setToken(response.data.token)
      setErrorMessage("")
      alert("Login successful!")
      reset()
    } catch (error) {
      setErrorMessage(
        error.response?.data?.error || "Login failed. Please try again."
      )
    }
  }

  return (
    <div className='App'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h1>Login</h1>

        <input
          placeholder='@example.com'
          {...register("email", {
            required: "Поле обязательно для заполнения!",
            pattern: {
              value: emailRegexp,
              message: "Введите корректный email.",
            },
          })}
        />

        <div className='errorMessage'>
          {errors?.email ? (
            <>
              <p>{errors?.email?.message} </p>
              <ul>
                <li style={{ color: emailConditions.containsAt ? "green" : "red" }}>
                  Содержит символ "@"
                </li>
                <li style={{ color: emailConditions.validDomain ? "green" : "red" }}>
                  Содержит корректный домен (например, example.com)
                </li>
              </ul>
            </>
          ) : null}
        </div>

        <input
          type='password'
          placeholder=' password'
          {...register("password", {
            required: "Поле обязательно для заполнения!",
            pattern: {
              value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
              message: "Введите корректный пароль.",
            },
          })}
        />

        <div className='errorMessage'>
          {errors?.password ? (
            <>
              <p>{errors?.password?.message || "Error"}</p>
              <ul>
                <li
                  style={{
                    color: passwordConditions.containsUpperCase ? "green" : "red",
                  }}>
                  Содержит хотя бы одну заглавную букву (A-Z)
                </li>
                <li
                  style={{
                    color: passwordConditions.containsLowerCase ? "green" : "red",
                  }}>
                  Содержит хотя бы одну строчную букву (a-z)
                </li>
                <li
                  style={{
                    color: passwordConditions.containsDigit ? "green" : "red",
                  }}>
                  Содержит хотя бы одну цифру (0-9)
                </li>
              </ul>
            </>
          ) : (
            <></>
          )}
        </div>

        <button type='submit'>Submit</button>
      </form>

      {/* Error Message */}
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

      {/* JWT Token Display */}
      {token && (
        <div>
          <h2>JWT Token:</h2>
          <p>{token}</p>
        </div>
      )}
    </div>
  )
}

export default App
