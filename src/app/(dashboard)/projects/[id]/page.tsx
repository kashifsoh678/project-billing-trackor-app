'use client'

import { DropResult } from '@hello-pangea/dnd'
import { Plus, Calendar, DollarSign, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import KanbanBoard, { TimeLogStatus } from '@/components/kanban/kanban-board'
import TimeLogForm from '@/components/time-tracking/time-log-form'
import BillingSummary from '@/components/projects/billing-summary'
import Modal from '@/components/ui/modal'
import { useMemo, useState } from 'react'

interface TimeLog {
    id: string
    project_id: string
    user_id: string
    hours: number
    notes: string
    log_date: string
    status: TimeLogStatus
}


// Mock Data
const MOCK_PROJECT = {
    id: '1',
    name: 'Website Redesign',
    description: 'Complete overhaul of the corporate website including new branding and CMS integration.',
    billing_rate: 85,
    status: 'active',
    created_at: '2025-01-15T10:00:00Z',
}

const INITIAL_LOGS = [
    {
        id: 'l1',
        project_id: '1',
        user_id: 'u1',
        hours: 2.5,
        notes: 'Initial wireframing for homepage',
        log_date: '2025-01-16',
        status: 'done' as TimeLogStatus,
    },
    {
        id: 'l2',
        project_id: '1',
        user_id: 'u1',
        hours: 4.0,
        notes: 'Component library setup in Figma',
        log_date: '2025-01-17',
        status: 'in-progress' as TimeLogStatus,
    },
    {
        id: 'l3',
        project_id: '1',
        user_id: 'u1',
        hours: 1.5,
        notes: 'Review meeting with stakeholders',
        log_date: '2025-01-18',
        status: 'todo' as TimeLogStatus,
    },
]

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function ProjectDetailsPage({ params }: { params: { id: string } }) {

    const [logs, setLogs] = useState(INITIAL_LOGS)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingLog, setEditingLog] = useState<TimeLog | null>(null)

    const totalHours = useMemo(() => logs.reduce((acc, log) => acc + log.hours, 0), [logs])

    const onDragEnd = (result: DropResult) => {
        const { destination, source, draggableId } = result

        if (!destination) return

        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return
        }

        const newLogs = Array.from(logs)
        const logIndex = newLogs.findIndex((log) => log.id === draggableId)
        const log = newLogs[logIndex]

        const updatedLog = { ...log, status: destination.droppableId as TimeLogStatus }

        // Optimistic update
        newLogs[logIndex] = updatedLog
        setLogs(newLogs)
    }

    const handleEditLog = (log: TimeLog) => {
        setEditingLog(log)
        setIsModalOpen(true)
    }

    const handleDeleteLog = (log: TimeLog) => {
        if (editingLog) {
            setLogs(logs.filter((l) => l.id !== editingLog.id))
            setIsModalOpen(false)
            setEditingLog(null)
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleSaveLog = (data: any) => {
        // Validation: Check total hours per day
        const logDate = data.log_date
        const newHours = Number(data.hours)

        // Calculate existing hours for this date, excluding current log if editing
        const existingLogs = logs.filter(l =>
            l.log_date === logDate &&
            (!editingLog || l.id !== editingLog.id)
        )
        const totalExistingHours = existingLogs.reduce((acc, l) => acc + l.hours, 0)

        if (totalExistingHours + newHours > 12) {
            alert(`Total hours for ${logDate} cannot exceed 12 hours. Current total: ${totalExistingHours + newHours}`)
            return
        }

        if (editingLog) {
            // Update existing log
            const updatedLogs = logs.map(l =>
                l.id === editingLog.id
                    ? { ...l, ...data, hours: newHours }
                    : l
            )
            setLogs(updatedLogs)
        } else {
            // Add new log
            const newLog = {
                id: Math.random().toString(36).substr(2, 9),
                project_id: MOCK_PROJECT.id,
                user_id: 'u1',
                ...data,
                hours: newHours,
            }
            setLogs([...logs, newLog])
        }

        setIsModalOpen(false)
        setEditingLog(null)
    }

    return (
        <div className="space-y-6 h-full flex flex-col">
            {/* Header */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors w-fit">
                    <ArrowLeft size={16} />
                    <Link href="/projects">Back to Projects</Link>
                </div>

                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">{MOCK_PROJECT.name}</h1>
                        <p className="text-muted-foreground mt-1 max-w-2xl">{MOCK_PROJECT.description}</p>
                    </div>
                    <Button onClick={() => setIsModalOpen(true)} className="gap-2 shrink-0">
                        <Plus size={18} />
                        Log Time
                    </Button>
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5 bg-muted/50 px-3 py-1.5 rounded-full">
                        <DollarSign size={16} className="text-primary" />
                        <span className="font-medium text-foreground">${MOCK_PROJECT.billing_rate}/hr</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-muted/50 px-3 py-1.5 rounded-full">
                        <Calendar size={16} />
                        <span>Created {new Date(MOCK_PROJECT.created_at).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0">
                {/* Kanban Board */}
                <div className="lg:col-span-3 min-h-[500px]">
                    <KanbanBoard logs={logs} onDragEnd={onDragEnd} onEdit={handleEditLog} onDelete={handleDeleteLog} />
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <BillingSummary totalHours={totalHours} billingRate={MOCK_PROJECT.billing_rate} />
                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false)
                    setEditingLog(null)
                }}
                title={editingLog ? "Edit Time Log" : "Add Time Log"}
            >
                <TimeLogForm
                    initialData={editingLog || undefined}
                    onSubmit={handleSaveLog}
                    onCancel={() => {
                        setIsModalOpen(false)
                        setEditingLog(null)
                    }}
                />
            </Modal>
        </div>
    )
}
