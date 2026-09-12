import axios from "axios";
import { AxiosError } from "axios";

export const getYouTubeVideoId = (url: string) => {
  try {
    return new URL(url).pathname.slice(1);
  } catch {
    return null;
  }
};

export const getVideoDuration = async (
  videoUrl: string,
): Promise<number | string> => {
  try {
    const videoId = getYouTubeVideoId(videoUrl);
    const { data } = await axios.get(
      `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,status&id=${videoId}&key=${process.env.YOUTUBE_API_KEY}`,
    );

    if (data?.items?.length === 0) {
      return "VIDEO_NOT_FOUND";
    }

    const duration = data?.items?.[0]?.contentDetails?.duration;
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);

    const status = data?.items?.[0]?.status?.privacyStatus;
    if (status !== "unlisted" && status !== "public") {
      return "INVALID_VIDEO_STATUS";
    }

    if (!match) return 0;

    const [, hours = "0", minutes = "0", seconds = "0"] = match;

    return Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds);
  } catch (error) {
    let message = "Something went wrong";
    if (error instanceof AxiosError) {
      message = error.response?.data?.message;
      console.log(error.response?.data);
    } else if (error instanceof Error) {
      message = error.message;
    } else {
      console.log(error);
    }
    return message;
  }
};
