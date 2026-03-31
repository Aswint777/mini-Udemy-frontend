import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import api from "../axios";
import axios from "axios";

interface User {
  _id: string;
  name: string;
  email: string;
  role: "student" | "instructor";
}

interface AuthResponse {
  user: User;
  message: string;
  accessToken: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  message: string | null;
}

interface SignUpData {
  name: string;
  email: string;
  password: string;
  role: string;
}

interface LoginData {
  email: string;
  password: string;
}

export const userSignUp = createAsyncThunk<
  AuthResponse,
  SignUpData,
  { rejectValue: string }
>("user/signUp", async (userData, { rejectWithValue }) => {
  try {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    const response = await fetch(`${API_URL}/userSignUpPost`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      return rejectWithValue(data.message || "Signup failed");
    }

    return data;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Something went wrong",
    );
  }
});

export const userLogin = createAsyncThunk<
  AuthResponse,
  LoginData,
  { rejectValue: string }
>("user/login", async (userData, { rejectWithValue }) => {
  try {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    const response = await axios.post(
      `${API_URL}/userLoginPost`,
      userData,
      { withCredentials: true },
    );
    return response.data;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Something went wrong",
    );
  }
});

export const userLogout = createAsyncThunk<
  string,
  void,
  { rejectValue: string }
>("user/logout", async (_, { rejectWithValue }) => {
  try {
    const response = await api.post("/logout");
    return response.data.message;
  } catch (error) {
    return rejectWithValue("Logout failed");
  }
});

export const checkAuth = createAsyncThunk(
  "user/checkAuth",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await api.get(`${API_URL}/checkAuth`, {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
        withCredentials: true,
      });

      return response.data.user;
    } catch (error) {
      return rejectWithValue("Not authenticated");
    }
  },
);

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  message: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // SIGNUP
      .addCase(userSignUp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        userSignUp.fulfilled,
        (state, action: PayloadAction<AuthResponse>) => {
          state.loading = false;
          state.message = action.payload.message;
        },
      )
      .addCase(userSignUp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Signup failed";
      })

      // LOGIN
      .addCase(userLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        userLogin.fulfilled,
        (state, action: PayloadAction<AuthResponse>) => {
          state.loading = false;
          state.user = action.payload.user;
          state.message = action.payload.message;
          localStorage.setItem("accessToken", action.payload.accessToken);
        },
      )
      .addCase(userLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Login failed";
      })

      //Logout
      .addCase(userLogout.pending, (state) => {
        state.loading = true;
      })
      .addCase(userLogout.fulfilled, (state, action) => {
        state.loading = false;
        state.user = null;
        state.message = action.payload;
        state.error = null;
        localStorage.removeItem("accessToken");
      })
      .addCase(userLogout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Logout failed";
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.user = null;
      });
  },
});

export const { clearError } = userSlice.actions;
export default userSlice.reducer;
