'use client'

import React from 'react'
import { DragDropContext, DropResult } from '@hello-pangea/dnd'
import KanbanColumn from './kanban-column'
import KanbanCard from './kanban-card'

import { TimeLog, TimeLogStatus } from '@/types'

interface KanbanBoardProps {
    logs: TimeLog[]
    onDragEnd: (result: DropResult) => void
    onEdit: (log: TimeLog) => void
    onDelete: (log: TimeLog) => void
}

const KanbanBoard = ({ logs, onDragEnd, onEdit, onDelete }: KanbanBoardProps) => {
    const columns: { id: TimeLogStatus; title: string }[] = [
        { id: TimeLogStatus.TODO, title: 'To Do' },
        { id: TimeLogStatus.IN_PROGRESS, title: 'In Progress' },
        { id: TimeLogStatus.DONE, title: 'Done' },
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
                                <KanbanCard key={log.id} log={log} index={index} onEdit={onEdit} onDelete={onDelete} />
                            ))}
                        </KanbanColumn>
                    )
                })}
            </div>
        </DragDropContext>
    )
}

export default KanbanBoard
