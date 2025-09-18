import { SiX, SiGithub, SiDiscord, SiFacebook, SiTelegram, SiInstagram, SiLinkedin, SiMedium, SiTiktok, SiYoutube } from "react-icons/si";
import { BsGlobe, BsPencilSquare, BsFileTextFill, BsBroadcastPin, BsBoundingBoxCircles, BsMicFill, BsCameraVideoFill } from "react-icons/bs";

export const iconMap: Record<string, JSX.Element> = {
  "twitter-x": <SiX className="w-5 h-5" />,
  github: <SiGithub className="w-5 h-5" />,
  discord: <SiDiscord className="w-5 h-5" />,
  linkedin: <SiLinkedin className="w-5 h-5" />,
  telegram: <SiTelegram className="w-5 h-5" />,
  facebook: <SiFacebook className="w-5 h-5" />,
  instagram: <SiInstagram className="w-5 h-5" />,
  medium: <SiMedium className="w-5 h-5" />,
  tiktok: <SiTiktok className="w-5 h-5" />,
  youtube: <SiYoutube className="w-5 h-5" />,
  globe: <BsGlobe className="w-5 h-5" />,
  "file-text-fill": <BsFileTextFill className="w-5 h-5" />,
  "pencil-square": <BsPencilSquare className="w-5 h-5" />,
  "broadcast-pin": <BsBroadcastPin className="w-5 h-5" />,
  "bounding-box-circles": <BsBoundingBoxCircles className="w-5 h-5" />,
  "mic-fill": <BsMicFill className="w-5 h-5" />,
  "camera-video-fill": <BsCameraVideoFill className="w-5 h-5" />,
};
