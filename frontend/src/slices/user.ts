import type { StateCreator } from "zustand";
import type { UserSlice } from "../types/user";

export const createUserSlice: StateCreator<UserSlice> = (set, get) => ({
  loading: false,
  user: {
    id: 11,
    role: "instructor",
    avatar: "/avatar-small.png",
    wallet: 0,
    skills: null,
    bio: null,
    created_at: "",
    name: "Shivam",
    email: "shivam@mail.com",
    login_type: "email",
    is_verified: false,
    is_banned: false,
    ban_reason: null,
    is_deleted: false,
    cover: null,
  },
  instructor: {
    id: 1,
    avatar: "/avatar-big.png",
    courses: 2,
    bio: "My name is Hitesh Choudhary, a retired corporate professional who has seamlessly transitioned into a full-time YouTuber. With a rich history as the founder of LCO (acquired) and a former CTO at iNeuron and Senior Director at PW, I bring a wealth of experience in building software and companies. My journey in the tech world has endowed me with unique insights and expertise, which I am passionate about sharing.",
    name: "Hitesh Choudhary",
    skills: ["javascript", "typescript", "react", "mongodb"],
    students: 100,
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
  becomeInstructor: () => {
    const { user } = get();
    set({ user: { ...user, role: "instructor" } });
  },
  updateAvatar: (avatar: string) => {
    const { user } = get();
    set({ user: { ...user, avatar } });
  },
});
