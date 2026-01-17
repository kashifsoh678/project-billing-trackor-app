'use client'

import React from 'react'
import { Droppable } from '@hello-pangea/dnd'
import { cn } from '@/lib/utils'

interface KanbanColumnProps {
    id: string
    title: string
    count: number
    children: React.ReactNode
}

const KanbanColumn = ({ id, title, count, children }: KanbanColumnProps) => {
    const columnColors = {
        todo: 'bg-gray-100/50 border-gray-200 dark:bg-gray-800/30 dark:border-gray-700',
        'in-progress': 'bg-blue-50/50 border-blue-100 dark:bg-blue-900/10 dark:border-blue-800',
        done: 'bg-green-50/50 border-green-100 dark:bg-green-900/10 dark:border-green-800',
    }

    const titleColors = {
        todo: 'bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
        'in-progress': 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
        done: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
    }

    return (
        <div className="flex flex-col h-full min-h-[500px] rounded-xl border bg-muted/20">
            <div className={cn("p-4 border-b flex items-center justify-between",
                columnColors[id as keyof typeof columnColors] || columnColors.todo
            )}>
                <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm uppercase tracking-wide">{title}</h3>
                    <span className={cn("px-2 py-0.5 rounded-full text-xs font-bold",
                        titleColors[id as keyof typeof titleColors] || titleColors.todo
                    )}>
                        {count}
                    </span>
                </div>
            </div>

            <Droppable droppableId={id}>
                {(provided, snapshot) => (
                    <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className={cn(
                            "flex-1 p-3 transition-colors",
                            snapshot.isDraggingOver ? "bg-muted/40" : ""
                        )}
                    >
                        {children}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </div>
    )
}

export default KanbanColumn
