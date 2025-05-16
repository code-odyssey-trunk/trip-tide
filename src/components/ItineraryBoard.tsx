"use client";

import ItineraryCard from "./ItineraryCard";
import { DndContext, closestCenter, DragEndEvent, DragOverlay } from "@dnd-kit/core";
import { SortableContext, useSortable, arrayMove, rectSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { initialDays, ItineraryItem, ItineraryDay } from "@/data/itineraryDays";

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
};

export default function ItineraryBoard({ initialTitle, initialDays: propDays }: ItineraryBoardProps) {
  const [days, setDays] = useState<ItineraryDay[]>(propDays || initialDays);
  const [activeItem, setActiveItem] = useState<ItineraryItem | null>(null);
  const [warning, setWarning] = useState<string>("");
  const [boardTitle, setBoardTitle] = useState<string>(initialTitle || "Trip to Malaysia");

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
      <div className="space-y-10">
        {/* Board Title and Date Range */}
        <div className="mb-8 text-center">
          <input
            className="text-4xl font-extrabold text-gray-900 mb-2 bg-transparent border-b-2 border-gray-200 focus:border-orange-400 outline-none text-center w-full max-w-xl mx-auto"
            value={boardTitle}
            onChange={e => setBoardTitle(e.target.value)}
            aria-label="Itinerary Title"
          />
          <div className="text-lg text-gray-500 font-medium">
            {startDate} - {endDate}
          </div>
        </div>
        {warning && (
          <div className="mb-4 p-3 bg-yellow-100 text-yellow-800 rounded border border-yellow-300 text-center font-semibold">
            {warning}
          </div>
        )}
        {days.map((day) => (
          <section key={day.id}>
            <div className="flex items-center gap-4 mb-4">
              <div className="text-2xl font-bold text-gray-800">{day.day}</div>
              <div className="bg-orange-100 text-orange-600 px-3 py-1 rounded-lg text-sm font-semibold">{day.date}</div>
            </div>
            <DroppableDay day={day}>
              <div className="flex flex-wrap gap-6 min-h-[120px]">
                <SortableContext items={day.items.map((item) => item.id)} strategy={rectSortingStrategy}>
                  {day.items.map((item) => (
                    <SortableCard key={item.id} item={item} dayId={day.id} />
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
      <DragOverlay>
        {activeItem ? <ItineraryCard {...activeItem} /> : null}
      </DragOverlay>
    </DndContext>
  );
} 