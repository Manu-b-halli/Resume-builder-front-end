// src/DragDropTest.jsx
import React, { useState } from 'react';
import { 
  DndContext, 
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  rectSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export default function DragDropTest() {
  const [items, setItems] = useState([
    {id: 'a', text: 'Item A'},
    {id: 'b', text: 'Item B'},
    {id: 'c', text: 'Item C'},
  ]);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 }
    })
  );

  function handleDragEnd(event) {
    const {active, over} = event;
    
    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);
        
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  return (
    <div style={{padding: '20px'}}>
      <h1>Drag & Drop Test</h1>
      <p>Try dragging these items:</p>
      
      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext 
          items={items.map(item => item.id)}
          strategy={rectSortingStrategy}
        >
          <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
            {items.map(item => (
              <SortableItem key={item.id} id={item.id} text={item.text} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}

function SortableItem({id, text}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({id});
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    border: '1px solid #ccc',
    padding: '10px',
    background: 'white',
    cursor: 'grab',
  };
  
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {text} (Drag me)
    </div>
  );
}