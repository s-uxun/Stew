import { create } from "zustand";
import axios from "axios";
import instance from "../api/axios";

export const DateStore = create((set) => ({
  activityData: {},
  currentDate: new Date(),
  totalPosts: 0,
  temperature: 0,
  status: "차가운 stew",

  setActivityData: (data) => set({ activityData: data }),
  setCurrentDate: (date) => set({ currentDate: date }),

  fetchData: async () => {
    const accessToken = localStorage.getItem("accessToken");
    const familycode = localStorage.getItem("familycode");
    try {
      const response = await instance.get(
        `${process.env.REACT_APP_SERVER_PORT}/report/calendar/${familycode}/`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      const data = response.data;

      // Set total posts
      const totalPosts = data.interests.find(
        (interest) => interest["총 게시물 수"]
      )["총 게시물 수"];
      set({ totalPosts });

      // Set temperature and status
      const temperature = data.interests.find((interest) => interest.stew_temp)[
        "stew_temp"
      ];
      const status = data.interests.find((interest) => interest.stew).stew;
      set({ temperature, status });

      // Set activity data
      const tempActivityData = {};
      data.calendar.forEach((entry) => {
        const date = new Date(entry.date).getDate();
        tempActivityData[date] = entry.user_count;
      });
      set({ activityData: tempActivityData });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  },
}));
