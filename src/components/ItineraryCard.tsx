'use client';

// import { ReactNode } from "react";
import { iconMap, IconName } from "../data/iconMap";

type ItineraryCardProps = {
  iconName: IconName;
  iconColor: string;
  type: string;
  title: string;
  details: string;
};

export default function ItineraryCard({
  iconName,
  iconColor,
  type,
  title,
  details,
}: ItineraryCardProps) {
  const Icon = iconMap[iconName];
  
  return (
    <div className="bg-white rounded-xl shadow hover:shadow-lg transition-shadow p-4 w-72 flex flex-col gap-2">
      <div className="flex items-center gap-3">
        <span className={`text-xl ${iconColor}`}><Icon /></span>
        <span className="text-sm font-semibold text-gray-700">{type}</span>
      </div>
      <div className="font-bold text-gray-800">{title}</div>
      <div className="text-gray-500 text-sm">{details}</div>
    </div>
  );
} 