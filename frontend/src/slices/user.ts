import type { StateCreator } from "zustand";
import type { UserSlice } from "../types/user";

export const createUserSlice: StateCreator<UserSlice> = (set, get) => ({
  loading: false,
  user: {
    id: 0,
    role: "instructor",
    avatar: "",
    wallet: 0,
    skills: null,
    bio: null,
    created_at: "",
    name: "",
    email: "",
    login_type: "email",
    is_verified: false,
    is_banned: false,
    ban_reason: null,
    is_deleted: false,
    cover: null,
  },
  instructor: {
    id: 0,
    avatar: "",
    courses: 0,
    bio: "",
    name: "",
    skills: [],
    students: 0,
  },
  instructors: [
    {
      id: 1,
      avatar: "/avatar-big.png",
      name: "Hitesh Choudhary",
      skills: ["JavaScript", "TypeScript", "Python"],
      courses: 2,
    },
    {
      id: 1,
      avatar: "/avatar-big.png",
      name: "Hitesh Choudhary",
      skills: ["JavaScript", "TypeScript", "Python"],
      courses: 2,
    },
    {
      id: 1,
      avatar: "/avatar-big.png",
      name: "Hitesh Choudhary",
      skills: ["JavaScript", "TypeScript", "Python"],
      courses: 2,
    },
    {
      id: 1,
      avatar: "/avatar-big.png",
      name: "Hitesh Choudhary",
      skills: ["JavaScript", "TypeScript", "Python"],
      courses: 2,
    },
    {
      id: 1,
      avatar: "/avatar-big.png",
      name: "Hitesh Choudhary",
      skills: ["JavaScript", "TypeScript", "Python"],
      courses: 2,
    },
    {
      id: 1,
      avatar: "/avatar-big.png",
      name: "Hitesh Choudhary",
      skills: ["JavaScript", "TypeScript", "Python"],
      courses: 2,
    },
    {
      id: 1,
      avatar: "/avatar-big.png",
      name: "Hitesh Choudhary",
      skills: ["JavaScript", "TypeScript", "Python"],
      courses: 2,
    },
    {
      id: 1,
      avatar: "/avatar-big.png",
      name: "Hitesh Choudhary",
      skills: ["JavaScript", "TypeScript", "Python"],
      courses: 2,
    },
    {
      id: 1,
      avatar: "/avatar-big.png",
      name: "Hitesh Choudhary",
      skills: ["JavaScript", "TypeScript", "Python"],
      courses: 2,
    },
    {
      id: 1,
      avatar: "/avatar-big.png",
      name: "Hitesh Choudhary",
      skills: ["JavaScript", "TypeScript", "Python"],
      courses: 2,
    },
    {
      id: 1,
      avatar: "/avatar-big.png",
      name: "Hitesh Choudhary",
      skills: ["JavaScript", "TypeScript", "Python"],
      courses: 2,
    },
  ],
  login: () => {},
  logOut: () => {
    set({
      user: {
        id: 0,
        role: "student",
        avatar: "",
        wallet: 0,
        skills: null,
        bio: null,
        created_at: "",
        name: "",
        email: "",
        login_type: "email",
        is_verified: false,
        is_banned: false,
        ban_reason: null,
        is_deleted: false,
      },
    });
  },
  setUser: (user) => {
    set({ user });
  },
  becomeInstructor: () => {
    const { user } = get();
    set({ user: { ...user, role: "instructor" } });
  },
  updateAvatar: (avatar: string) => {
    const { user } = get();
    set({ user: { ...user, avatar } });
  },
});
