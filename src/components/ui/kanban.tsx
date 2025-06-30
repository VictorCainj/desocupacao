'use client'

import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { DragEndEvent } from '@dnd-kit/core'
import { DndContext, rectIntersection, useDraggable, useDroppable } from '@dnd-kit/core'
import type { ReactNode } from 'react'

export type Status = {
  id: string
  name: string
  color: string
}

export type Feature = {
  id: string
  name: string
  startAt: Date
  endAt: Date
  status: Status
}

export type KanbanBoardProps = {
  id: Status['id']
  children: ReactNode
  className?: string
}

export const KanbanBoard = ({ id, children, className }: KanbanBoardProps) => {
  const { isOver, setNodeRef } = useDroppable({ id })

  return (
    <div
      className={cn(
        'flex flex-col gap-2 rounded-md border bg-secondary p-2 text-xs shadow-sm outline outline-2 transition-all min-h-40',
        isOver ? 'outline-primary' : 'outline-transparent',
        className
      )}
      ref={setNodeRef}
    >
      {children}
    </div>
  )
}

export type KanbanCardProps = Pick<Feature, 'id' | 'name'> & {
  index: number
  parent: string
  children?: ReactNode
  className?: string
}

export const KanbanCard = ({ id, name, index, parent, children, className }: KanbanCardProps) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
    data: { index, parent },
  })

  return (
    <Card
      className={cn('rounded-md p-3 shadow-sm relative', isDragging && 'opacity-50', className)}
      style={{
        transform: transform ? `translateX(${transform.x}px) translateY(${transform.y}px)` : 'none',
      }}
      ref={setNodeRef}
    >
      {/* Handle de drag que permite arrastar o card */}
      <div
        className="absolute inset-0 cursor-grab rounded-md"
        style={{ zIndex: 1 }}
        {...listeners}
        {...attributes}
      />

      {/* Conteúdo do card com z-index maior para permitir cliques */}
      <div className="relative" style={{ zIndex: 10 }}>
        {children ?? <p className="m-0 font-medium text-sm">{name}</p>}
      </div>
    </Card>
  )
}

export type KanbanCardsProps = {
  children: ReactNode
  className?: string
}

export const KanbanCards = ({ children, className }: KanbanCardsProps) => (
  <div className={cn('flex flex-1 flex-col gap-2', className)}>{children}</div>
)

export type KanbanHeaderProps =
  | {
      children: ReactNode
    }
  | {
      name: Status['name']
      color: Status['color']
      className?: string
    }

export const KanbanHeader = (props: KanbanHeaderProps) =>
  'children' in props ? (
    props.children
  ) : (
    <div className={cn('flex shrink-0 items-center gap-2 mb-2', props.className)}>
      <div className="h-2 w-2 rounded-full" style={{ backgroundColor: props.color }} />
      <p className="m-0 font-semibold text-sm">{props.name}</p>
    </div>
  )

export type KanbanProviderProps = {
  children: ReactNode
  onDragEnd: (event: DragEndEvent) => void
  className?: string
}

export const KanbanProvider = ({ children, onDragEnd, className }: KanbanProviderProps) => (
  <DndContext collisionDetection={rectIntersection} onDragEnd={onDragEnd}>
    <div className={cn('flex gap-4 min-h-full', className)}>{children}</div>
  </DndContext>
)
