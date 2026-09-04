export interface UserI {
  id: number;
  role: "student" | "instructor" | "admin";
  wallet: number;
  skills: string[] | null;
  bio: string | null;
  created_at: string;
  name: string;
  email: string;
  login_type: "email" | "google";
  is_verified: boolean;
  is_banned: boolean;
  ban_reason: string | null;
  avatar: string | null;
  is_deleted: boolean;
}

export interface Instructor {
  id: number;
  avatar: string;
  name: string;
  skills: string[];
  courses: number;
}

export interface UserSlice {
  loading: false;
  instructor: Instructor & {
    bio: string;
    students: number;
    courses: number;
  };
  instructors: Instructor[];
  user: UserI;
  login: (user: UserI) => void;
  logOut: () => void;
  setUser: (user: UserI) => void;
  becomeInstructor: () => void;
  updateAvatar: (avatar: string) => void;
}
