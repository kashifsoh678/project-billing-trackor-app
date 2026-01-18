'use client'

import React from 'react'
import { DragDropContext, DropResult } from '@hello-pangea/dnd'
import KanbanColumn from './kanban-column'
import KanbanCard from './kanban-card'

export type TimeLogStatus = 'todo' | 'in-progress' | 'done'

interface TimeLog {
    id: string
    project_id: string
    user_id: string
    hours: number
    notes: string
    log_date: string
    status: TimeLogStatus
}

interface KanbanBoardProps {
    logs: TimeLog[]
    onDragEnd: (result: DropResult) => void
    onEdit: (log: TimeLog) => void
}

const KanbanBoard = ({ logs, onDragEnd, onEdit }: KanbanBoardProps) => {
    const columns: { id: TimeLogStatus; title: string }[] = [
        { id: 'todo', title: 'To Do' },
        { id: 'in-progress', title: 'In Progress' },
        { id: 'done', title: 'Done' },
    ]

    const getLogsByStatus = (status: TimeLogStatus) => {
        return logs.filter((log) => log.status === status)
    }

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
                {columns.map((column) => {
                    const columnLogs = getLogsByStatus(column.id)
                    return (
                        <KanbanColumn
                            key={column.id}
                            id={column.id}
                            title={column.title}
                            count={columnLogs.length}
                        >
                            {columnLogs.map((log, index) => (
                                <KanbanCard key={log.id} log={log} index={index} onEdit={onEdit} />
                            ))}
                        </KanbanColumn>
                    )
                })}
            </div>
        </DragDropContext>
    )
}

export default KanbanBoard
