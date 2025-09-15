import { Virtuoso } from 'react-virtuoso';
import { TrackModel } from '@shared/types/vimp';
import { ScrollArea } from '@renderer/components/common/scroll-area';
import TrackRow from './TrackRow';

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';

import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useState } from 'react';

interface TrackListProps {
  items: TrackModel[];
  onItemClick: (trackID: string) => void;
  onScroll?: (scrollTop: number) => void;
  onItemMove: (from: number, to: number, items: TrackModel[]) => void;
}

// TODO Implementar multi seleção
export default function TrackList(props: TrackListProps) {
  const { items, onItemClick, onScroll, onItemMove } = props;
  const trackIDs = items.map((track) => track._id);
  const [selectedIDs, setSelectedIDs] = useState<string[]>([]);
  const [lastClickedID, setLastClickedID] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item._id === active.id);
      const newIndex = items.findIndex((item) => item._id === over.id);

      onItemMove(oldIndex, newIndex, items);
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className='flex h-full flex-col items-center justify-start'>
        <div className='text-text-primary grid h-9 w-full grid-cols-[16px_6fr_4fr_3fr_1fr] gap-4 px-4 text-sm select-none'>
          <span className='flex items-center justify-center'>#</span>
          <span className='flex items-center'>Titulo</span>
          <span className='flex items-center'>Album</span>
          <span className='flex items-center justify-center'>Status</span>
          <span className='flex items-center justify-end'>Duração</span>
        </div>
        <div className='bg-surface-active h-[1px] w-full' />
        {items.length > 0 ? (
          <SortableContext
            items={trackIDs}
            strategy={verticalListSortingStrategy}
          >
            <Virtuoso
              components={{
                Scroller: ScrollArea,
              }}
              data={items}
              className='w-full'
              overscan={5}
              itemContent={(index, track) => (
                <TrackRow
                  key={`${index}-${track.title}`}
                  index={index}
                  track={track}
                  onClick={onItemClick}
                  isSelected={selectedIDs.includes(track._id)}
                />
              )}
              onScroll={(e) => {
                if (!onScroll) return;
                const target = e.target as HTMLElement;
                onScroll(target.scrollTop);
              }}
            />
          </SortableContext>
        ) : (
          <div className='text-text-secondary flex size-full items-center justify-center'>
            <p>Lista vazia</p>
          </div>
        )}
      </div>
    </DndContext>
  );
}
