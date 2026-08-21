import type { StateCreator } from "zustand";
import type { ReviewSlice } from "../types/review";

export const createReviewSlice: StateCreator<ReviewSlice> = () => ({
  reviews: [
    {
      rating: 5,
      user_name: "Erwin",
      user_avatar: "/avatar-small.png",
      review:
        "The way he teach is very simple but realistic how should you do if there is a bug, this means you do not memorize the code but understand how it flows. appriciate the method of teaching",
      course: 2,
      course_name: "React.js",
      created_at: "2026-06-09 10:29:29.628101+00",
      id: 1,
      user_id: 2,
    },
    {
      rating: 4,
      user_name: "Fatih Suat",
      user_avatar: "/avatar-small.png",
      review:
        "This is the first time I am writing a review before finishing the course. These guys know what they're doing. But there's only one thing to say about Hitesh: He is the king of instructors. I highly recommend this course.",
      course: 2,
      course_name: "React.js",
      created_at: "2026-06-09 10:29:29.628101+00",
      id: 1,
      user_id: 2,
    },
    {
      rating: 4,
      user_name: "Rocky",
      user_avatar: "/avatar-small.png",
      review:
        "I’m loving every bit of this course. The instructors are top-notch and truly among the best in the industry. Especially Hitesh Choudhary, his ability to make even the toughest concepts feel easy is incredible. The course structure is very inviting for newcomers. 10/10!",
      course: 2,
      course_name: "React.js",
      created_at: "2026-06-09 10:29:29.628101+00",
      id: 1,
      user_id: 2,
    },
    {
      rating: 1,
      user_name: "Ramesh",
      user_avatar: "/avatar-small.png",
      review:
        "The first part of the course is good the React.js part there everything is explained properly in a clear way with good example and explanation is in a beginner way easy to understand. But the second part of Next.js and all after that, the instructor is not at all giving proper explanation about each topics , because he is only copy and pasting the code he is not explaining any topic/stuff in proper easy to understand manner. I'm not at all satisfied by this course second part.",
      course: 2,
      course_name: "Structuring using HTML",
      created_at: "2026-06-09 10:29:29.628101+00",
      id: 1,
      user_id: 2,
    },
    {
      rating: 4,
      user_name: "Rohit",
      user_avatar: "/avatar-small.png",
      review: "",
      course: 2,
      course_name: "Introduction to Vue.js",
      created_at: "2026-06-09 10:29:29.628101+00",
      id: 1,
      user_id: 2,
    },
    {
      rating: 2,
      user_name: "Mayank",
      user_avatar: "/avatar-small.png",
      review:
        "First instructor is good nicely covers react but the second one makes it a NIGHTMARE => no proper explanations , directly coding without context , no proper set up walkthrough, worst tutorials I have ever seen explanation are ambiguous and NOT understandable , read Next.js official docs WAYY better..",
      course: 2,
      course_name: "Styling using CSS",
      created_at: "2026-06-09 10:29:29.628101+00",
      id: 1,
      user_id: 2,
    },
  ],
});
