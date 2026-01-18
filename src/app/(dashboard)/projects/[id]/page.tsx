'use client'

import { DropResult } from '@hello-pangea/dnd'
import { Plus, Calendar, DollarSign, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { TimeLog, TimeLogStatus } from '@/types'
import { TimeLogInput } from '@/lib/validators'
import { useMemo, useState } from 'react'
import KanbanBoard from '@/components/kanban/kanban-board'
import TimeLogForm from '@/components/time-tracking/time-log-form'
import BillingSummary from '@/components/projects/billing-summary'
import Modal from '@/components/ui/modal'
import { ConfirmModal } from '@/components/ui/confirm-modal'
import { useProject } from '@/hooks/use-projects'
import {
    useTimeLogs,
    useCreateTimeLog,
    useUpdateTimeLog,
    useDeleteTimeLog,
    useBillingSummary
} from '@/hooks/use-time-logs'
import { useParams } from 'next/navigation'
import { ProjectDetailSkeleton } from '@/components/projects/project-detail-skeleton'
import { useAuth } from '@/context/auth-context'
import { Role } from '@/types/enums'


export default function ProjectDetailsPage() {
    const { id } = useParams() as { id: string }
    const { user } = useAuth()
    const isAdmin = user?.role === Role.ADMIN

    const { data: project, isLoading: isProjectLoading } = useProject(id)
    const { data: logsResponse, isLoading: isLogsLoading } = useTimeLogs({ projectId: id, limit: 1000 })
    const logs = useMemo(() => logsResponse?.data || [], [logsResponse])
    const { data: billing } = useBillingSummary(isAdmin ? id : '')

    const createLogMutation = useCreateTimeLog()
    const updateLogMutation = useUpdateTimeLog()
    const deleteLogMutation = useDeleteTimeLog()

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingLog, setEditingLog] = useState<TimeLog | null>(null)
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [logToDelete, setLogToDelete] = useState<TimeLog | null>(null)

    const totalHours = useMemo(() => {
        if (isAdmin && billing) return billing.totalHours
        return logs.reduce((acc, log) => acc + log.hours, 0)
    }, [isAdmin, billing, logs])

    const onDragEnd = (result: DropResult) => {
        const { destination, source, draggableId } = result

        if (!destination) return

        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return
        }

        const log = logs.find((l) => l.id === draggableId)
        if (!log) return

        updateLogMutation.mutate({
            id: draggableId,
            data: { status: destination.droppableId as TimeLogStatus }
        })
    }

    const handleEditLog = (log: TimeLog) => {
        setEditingLog(log)
        setIsModalOpen(true)
    }

    const handleDeleteLog = (log: TimeLog) => {
        setLogToDelete(log)
        setDeleteModalOpen(true)
    }

    const handleConfirmDelete = () => {
        if (!logToDelete) return
        deleteLogMutation.mutate(logToDelete.id, {
            onSuccess: () => {
                setDeleteModalOpen(false)
                setLogToDelete(null)
            }
        })
    }

    const handleSaveLog = (data: TimeLogInput) => {
        if (editingLog) {
            updateLogMutation.mutate({
                id: editingLog.id,
                data: {
                    ...data,
                    hours: Number(data.hours),
                    logDate: new Date(data.logDate)
                }
            }, {
                onSuccess: () => {
                    setIsModalOpen(false)
                    setEditingLog(null)
                }
            })
        } else {
            createLogMutation.mutate({
                ...data,
                projectId: id,
                hours: Number(data.hours),
                logDate: new Date(data.logDate)
            }, {
                onSuccess: () => {
                    setIsModalOpen(false)
                    setEditingLog(null)
                }
            })
        }
    }

    if (isProjectLoading || isLogsLoading) {
        return <ProjectDetailSkeleton />
    }

    if (!project) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
                <h2 className="text-2xl font-semibold">Project not found</h2>
                <Link href="/projects">
                    <Button variant="outline">Back to Projects</Button>
                </Link>
            </div>
        )
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
                        <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
                        <p className="text-muted-foreground mt-1 max-w-2xl">{project.description}</p>
                    </div>
                    <Button onClick={() => setIsModalOpen(true)} className="gap-2 shrink-0">
                        <Plus size={18} />
                        Log Time
                    </Button>
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    {isAdmin && (
                        <div className="flex items-center gap-1.5 bg-muted/50 px-3 py-1.5 rounded-full">
                            <DollarSign size={16} className="text-primary" />
                            <span className="font-medium text-foreground">${project.billingRate}/hr</span>
                        </div>
                    )}
                    <div className="flex items-center gap-1.5 bg-muted/50 px-3 py-1.5 rounded-full">
                        <Calendar size={16} />
                        <span>Created {new Date(project.createdAt).toLocaleDateString()}</span>
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
                    {isAdmin ? (
                        <BillingSummary totalHours={totalHours} billingRate={project.billingRate} />
                    ) : (
                        <div className="bg-card border rounded-xl p-6 shadow-sm">
                            <h3 className="font-semibold text-lg mb-4">Your Summary</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Total Hours Logged</span>
                                    <span className="text-2xl font-bold">{totalHours.toFixed(1)}h</span>
                                </div>
                            </div>
                        </div>
                    )}
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
                    projectId={id}
                    initialData={editingLog || undefined}
                    onSubmit={handleSaveLog}
                    onCancel={() => {
                        setIsModalOpen(false)
                        setEditingLog(null)
                    }}
                />
            </Modal>

            <ConfirmModal
                isOpen={deleteModalOpen}
                onClose={() => {
                    setDeleteModalOpen(false)
                    setLogToDelete(null)
                }}
                onConfirm={handleConfirmDelete}
                title="Delete Time Entry"
                description="Are you sure you want to delete this time entry? This action cannot be undone."
                confirmText="Delete"
                variant="danger"
                isLoading={deleteLogMutation.isPending}
            />
        </div>
    )
}
