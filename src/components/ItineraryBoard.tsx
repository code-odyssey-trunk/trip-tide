"use client";

import ItineraryCard from "./ItineraryCard";
import { DndContext, closestCenter, DragEndEvent, DragOverlay } from "@dnd-kit/core";
import { SortableContext, useSortable, arrayMove, rectSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { initialDays, ItineraryItem, ItineraryDay } from "@/data/itineraryDays";
import Image from "next/image";
import Link from "next/link";
import ItineraryFormModal from "./ItineraryFormModal";
import { v4 as uuidv4 } from 'uuid';

// Sortable Card
function SortableCard({ item, dayId }: { item: ItineraryItem; dayId: string }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
    data: { item, dayId },
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 50 : 1,
      }}
      {...attributes}
      {...listeners}
    >
      <ItineraryCard {...item} />
    </div>
  );
}

// Droppable Day
function DroppableDay({ day, children }: { day: ItineraryDay; children: React.ReactNode }) {
  const { setNodeRef } = useDroppable({
    id: day.id,
  });
  return <div ref={setNodeRef}>{children}</div>;
}

type ItineraryBoardProps = {
  initialTitle?: string;
  initialDays?: ItineraryDay[];
  headerImage?: string;
};

export default function ItineraryBoard({ 
  initialTitle, 
  initialDays: propDays,
  headerImage = "/place/malaysia.jpg" // Default image
}: ItineraryBoardProps) {
  const [days, setDays] = useState<ItineraryDay[]>(propDays || initialDays);
  const [activeItem, setActiveItem] = useState<ItineraryItem | null>(null);
  const [warning, setWarning] = useState<string>("");
  const [boardTitle, setBoardTitle] = useState<string>(initialTitle || "Trip to Malaysia");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDayId, setSelectedDayId] = useState<string>("");
  const [editingItem, setEditingItem] = useState<ItineraryItem | null>(null);

  // Get start and end date from the first and last day
  const startDate = days.length > 0 ? days[0].date : "";
  const endDate = days.length > 0 ? days[days.length - 1].date : "";

  function findDayAndIndex(itemId: string) {
    for (let d = 0; d < days.length; d++) {
      const idx = days[d].items.findIndex((i) => i.id === itemId);
      if (idx !== -1) return { dayIdx: d, itemIdx: idx };
    }
    return null;
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) {
      setActiveItem(null);
      return;
    }

    // Find source and destination
    const from = findDayAndIndex(active.id as string);
    const to = findDayAndIndex(over.id as string);

    // Prevent removing the last card from a day
    if (from && days[from.dayIdx].items.length === 1) {
      setWarning("Each day must have at least one itinerary card.");
      setActiveItem(null);
      return;
    }

    // If dropped on another card
    if (from && to) {
      if (from.dayIdx === to.dayIdx) {
        // Same day: reorder
        const newItems = arrayMove(
          days[from.dayIdx].items,
          from.itemIdx,
          to.itemIdx
        );
        const newDays = [...days];
        newDays[from.dayIdx] = { ...newDays[from.dayIdx], items: newItems };
        setDays(newDays);
      } else {
        // Different day: move
        const item = days[from.dayIdx].items[from.itemIdx];
        const newFromItems = [...days[from.dayIdx].items];
        newFromItems.splice(from.itemIdx, 1);
        const newToItems = [...days[to.dayIdx].items];
        newToItems.splice(to.itemIdx, 0, item);
        const newDays = [...days];
        newDays[from.dayIdx] = { ...newDays[from.dayIdx], items: newFromItems };
        newDays[to.dayIdx] = { ...newDays[to.dayIdx], items: newToItems };
        setDays(newDays);
      }
    }
    // If dropped on empty day (not on a card)
    else if (from && over.id) {
      // Prevent removing the last card from a day
      if (days[from.dayIdx].items.length === 1) {
        setWarning("Each day must have at least one itinerary card.");
        setActiveItem(null);
        return;
      }
      const destDayIdx = days.findIndex((d) => d.id === over.id);
      if (destDayIdx !== -1) {
        const item = days[from.dayIdx].items[from.itemIdx];
        const newFromItems = [...days[from.dayIdx].items];
        newFromItems.splice(from.itemIdx, 1);
        const newToItems = [...days[destDayIdx].items, item];
        const newDays = [...days];
        newDays[from.dayIdx] = { ...newDays[from.dayIdx], items: newFromItems };
        newDays[destDayIdx] = { ...newDays[destDayIdx], items: newToItems };
        setDays(newDays);
      }
    }
    setActiveItem(null);
  }

  const handleEditItem = (item: ItineraryItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDeleteItem = (itemId: string, dayId: string) => {
    const dayIndex = days.findIndex(d => d.id === dayId);
    if (dayIndex !== -1 && days[dayIndex].items.length > 1) {
      const newDays = [...days];
      newDays[dayIndex] = {
        ...newDays[dayIndex],
        items: newDays[dayIndex].items.filter(item => item.id !== itemId)
      };
      setDays(newDays);
    } else {
      setWarning("Each day must have at least one itinerary card.");
    }
  };

  const handleSubmitItem = (formData: Omit<ItineraryItem, 'id'>, dayId: string) => {
    if (editingItem) {
      // Update existing item
      const newDays = days.map(day => ({
        ...day,
        items: day.items.map(item => 
          item.id === editingItem.id ? { ...formData, id: item.id } : item
        )
      }));
      setDays(newDays);
    } else {
      // Add new item
      const newItem: ItineraryItem = {
        ...formData,
        id: uuidv4()
      };
      const newDays = days.map(day => 
        day.id === dayId 
          ? { ...day, items: [...day.items, newItem] }
          : day
      );
      setDays(newDays);
    }
  };

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={event => {
        const { active } = event;
        const found = days.flatMap(day => day.items).find(i => i.id === active.id);
        setActiveItem(found || null);
        setWarning("");
      }}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveItem(null)}
    >
      <div className="min-h-screen">
        {/* Fixed Header */}
        <div className="fixed top-0 left-0 right-0 z-50 px-4 pt-4">
          <div className="relative h-64 w-full rounded-2xl overflow-hidden">
            <Image
              src={headerImage}
              alt="Trip Header"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
            
            {/* Back Button */}
            <div className="absolute top-4 left-4 z-50">
              <Link 
                href="/trips"
                className="px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 group cursor-pointer bg-black/30 hover:bg-black/40 text-white backdrop-blur-sm"
              >
                <svg 
                  className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Trips
              </Link>
            </div>

            <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
              <input
                className="text-4xl font-extrabold bg-transparent border-b-2 border-white/30 focus:border-white outline-none text-center w-full max-w-xl mx-auto text-white placeholder-white/80"
                value={boardTitle}
                onChange={e => setBoardTitle(e.target.value)}
                placeholder="Enter trip title"
                aria-label="Itinerary Title"
              />
              <div className="text-lg font-medium text-white/90 mt-2">
                {startDate} - {endDate}
              </div>
            </div>

            {/* Add Itinerary Button */}
            <div className="absolute top-4 right-4">
              <button
                onClick={() => {
                  setSelectedDayId(days[0]?.id || "");
                  setEditingItem(null);
                  setIsModalOpen(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl group"
              >
                <svg 
                  className="w-5 h-5 transform group-hover:scale-110 transition-transform" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Add Itinerary
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="pt-[calc(256px+1rem)] px-4">
          {warning && (
            <div className="mb-4 p-3 bg-yellow-100 text-yellow-800 rounded border border-yellow-300 text-center font-semibold">
              {warning}
            </div>
          )}

          {days.map((day) => (
            <section key={day.id} className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="text-2xl font-bold text-gray-800">{day.day}</div>
                <div className="bg-orange-100 text-orange-600 px-3 py-1 rounded-lg text-sm font-semibold">{day.date}</div>
              </div>
              <DroppableDay day={day}>
                <div className="flex flex-wrap gap-6 min-h-[120px]">
                  <SortableContext items={day.items.map((item) => item.id)} strategy={rectSortingStrategy}>
                    {day.items.map((item) => (
                      <div key={item.id} className="relative group">
                        <SortableCard item={item} dayId={day.id} />
                        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleEditItem(item)}
                            className="p-1 bg-white/90 rounded-full hover:bg-white shadow-sm"
                          >
                            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item.id, day.id)}
                            className="p-1 bg-white/90 rounded-full hover:bg-white shadow-sm"
                          >
                            <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </SortableContext>
                  {day.items.length === 0 && (
                    <div className="w-72 h-24 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-xl text-gray-400 bg-gray-50 pointer-events-none select-none">
                      Drop here
                    </div>
                  )}
                </div>
              </DroppableDay>
            </section>
          ))}
        </div>
      </div>

      <DragOverlay>
        {activeItem ? <ItineraryCard {...activeItem} /> : null}
      </DragOverlay>

      <ItineraryFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingItem(null);
        }}
        onSubmit={handleSubmitItem}
        initialData={editingItem || undefined}
        dayId={selectedDayId}
        days={days}
      />
    </DndContext>
  );
} 