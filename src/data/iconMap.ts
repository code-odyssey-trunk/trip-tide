import { FaPlaneDeparture, FaHotel, FaUtensils, FaMapMarkerAlt, FaStickyNote, FaUmbrellaBeach, FaShoppingBag } from "react-icons/fa";
import { IconType } from "react-icons";

export const iconMap: Record<string, IconType> = {
  FaPlaneDeparture,
  FaHotel,
  FaUtensils,
  FaMapMarkerAlt,
  FaStickyNote,
  FaUmbrellaBeach,
  FaShoppingBag,
};

export type IconName = keyof typeof iconMap; 