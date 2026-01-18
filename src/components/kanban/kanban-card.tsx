'use client'

import React from 'react'
import { Draggable } from '@hello-pangea/dnd'
import { Clock, MoreHorizontal } from 'lucide-react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

import { TimeLog } from '@/types'

interface KanbanCardProps {
    log: TimeLog
    index: number
    onEdit: (log: TimeLog) => void
    onDelete: (log: TimeLog) => void
}

const KanbanCard = ({ log, index, onEdit, onDelete }: KanbanCardProps) => {
    const [showMenu, setShowMenu] = React.useState(false)
    const menuRef = React.useRef<HTMLDivElement>(null)

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowMenu(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])
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
                        <CardContent className="p-4 pb-2 ">
                            <div className="flex justify-between items-start gap-2 ">
                                <p className="text-sm font-medium line-clamp-3 ">{log.notes}</p>
                                <div className="relative " ref={menuRef}>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 w-6 p-0 text-muted-foreground shrink-0 hover:bg-muted"
                                        onClick={(e) => {
                                            e.preventDefault()
                                            setShowMenu(!showMenu)
                                        }}
                                    >
                                        <MoreHorizontal size={14} />
                                    </Button>
                                    {showMenu && (
                                        <div className="absolute right-0 mt-1 w-32 rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in fade-in-0 zoom-in-95">
                                            <div className="flex flex-col p-1">
                                                <button
                                                    className="relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground text-left"
                                                    onClick={(e) => {
                                                        e.preventDefault()
                                                        onEdit(log)
                                                        setShowMenu(false)
                                                    }}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground text-left text-destructive"
                                                    onClick={(e) => {
                                                        e.preventDefault()
                                                        onDelete(log)
                                                        setShowMenu(false)
                                                    }}
                                                >
                                                    Delete
                                                </button>

                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="p-4 pt-2 flex justify-between text-xs text-muted-foreground">
                            <div className="flex items-center gap-1.5 bg-muted/50 px-2 py-1 rounded-md">
                                <Clock size={12} />
                                <span className="font-medium">{log.hours}h</span>
                            </div>
                            <span>{new Date(log.logDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                        </CardFooter>
                    </Card>
                </div>
            )}
        </Draggable>
    )
}

export default KanbanCard
