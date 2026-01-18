'use client'

import React from 'react'
import { Draggable } from '@hello-pangea/dnd'
import { Clock, MoreHorizontal } from 'lucide-react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface TimeLog {
    id: string
    project_id: string
    user_id: string
    hours: number
    notes: string
    log_date: string
    status: 'todo' | 'in-progress' | 'done'
}

interface KanbanCardProps {
    log: TimeLog
    index: number
    onEdit: (log: TimeLog) => void
}

const KanbanCard = ({ log, index, onEdit }: KanbanCardProps) => {
    return (
        <Draggable draggableId={log.id} index={index}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="mb-3"
                    style={{ ...provided.draggableProps.style }}
                >
                    <Card
                        className={`cursor-grab active:cursor-grabbing hover:border-primary/50 transition-colors ${snapshot.isDragging ? 'shadow-lg ring-2 ring-primary/20 rotate-2' : 'shadow-sm'
                            }`}
                    >
                        <CardContent className="p-4 pb-2">
                            <div className="flex justify-between items-start gap-2">
                                <p className="text-sm font-medium line-clamp-3">{log.notes}</p>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0 text-muted-foreground shrink-0"
                                    onClick={() => onEdit(log)}
                                >
                                    <MoreHorizontal size={14} />
                                </Button>
                            </div>
                        </CardContent>
                        <CardFooter className="p-4 pt-2 flex justify-between text-xs text-muted-foreground">
                            <div className="flex items-center gap-1.5 bg-muted/50 px-2 py-1 rounded-md">
                                <Clock size={12} />
                                <span className="font-medium">{log.hours}h</span>
                            </div>
                            <span>{new Date(log.log_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                        </CardFooter>
                    </Card>
                </div>
            )}
        </Draggable>
    )
}

export default KanbanCard
