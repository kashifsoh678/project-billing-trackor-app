'use client'

import React, { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import ProjectCard from '@/components/projects/project-card'
import Modal from '@/components/ui/modal'
import ProjectForm from '@/components/projects/project-form'
import { Input } from '@/components/ui/input'
import { Project } from '@/types'
import { useProjects, useCreateProject, useUpdateProject, useArchiveProject } from '@/hooks/use-projects'
import { ProjectInput } from '@/lib/validators'
import { useAuth } from '@/context/auth-context'
import { Role } from '@/types/enums'
import { ConfirmModal } from '@/components/ui/confirm-modal'
import { useDebounce } from '@/hooks/use-debounce'
import { Search, X, Loader2, Filter } from 'lucide-react'

export default function ProjectsPage() {
    const { user } = useAuth()
    const isAdmin = user?.role === Role.ADMIN

    const [currentPage, setCurrentPage] = useState(1)
    const ITEMS_PER_PAGE = 9
    const [searchQuery, setSearchQuery] = useState('')
    const debouncedSearchQuery = useDebounce(searchQuery, 500)

    // Only search if empty or at least 2 characters
    const effectiveSearch = debouncedSearchQuery.length >= 2 || debouncedSearchQuery.length === 0
        ? debouncedSearchQuery
        : ''

    const [statusFilter, setStatusFilter] = useState('')

    const { data, isLoading, isError, isFetching } = useProjects({
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        search: effectiveSearch,
        status: statusFilter || undefined
    })

    const isSearching = isLoading || isFetching

    const createProjectMutation = useCreateProject()
    const updateProjectMutation = useUpdateProject()
    const archiveProjectMutation = useArchiveProject()

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false)
    const [editingProject, setEditingProject] = useState<Project | null>(null)
    const [projectToArchive, setProjectToArchive] = useState<Project | null>(null)

    const handleSaveProject = async (data: ProjectInput) => {
        if (editingProject) {
            await updateProjectMutation.mutateAsync({ id: editingProject.id, input: data })
        } else {
            await createProjectMutation.mutateAsync(data)
        }
        setIsModalOpen(false)
        setEditingProject(null)
    }

    const handleEditProject = (project: Project) => {
        setEditingProject(project)
        setIsModalOpen(true)
    }

    const handleArchiveConfirm = async () => {
        if (projectToArchive) {
            await archiveProjectMutation.mutateAsync(projectToArchive.id)
            setIsArchiveModalOpen(false)
            setProjectToArchive(null)
        }
    }

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage)
    }

    const projects = data?.data || []
    const totalPages = data?.meta.totalPages || 0

    return (
        <div className="space-y-8 h-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage your active projects and track billing.
                    </p>
                </div>
                {isAdmin && (
                    <Button
                        className="gap-2"
                        onClick={() => {
                            setEditingProject(null)
                            setIsModalOpen(true)
                        }}
                    >
                        <Plus size={18} />
                        New Project
                    </Button>
                )}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="flex items-center gap-2 w-full max-w-sm relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground size-4" />
                    <Input
                        placeholder="Search projects..."
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value)
                            setCurrentPage(1)
                        }}
                        className="h-10 pl-9 pr-10"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => {
                                setSearchQuery('')
                                setCurrentPage(1)
                            }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 rounded-full hover:bg-muted transition-colors"
                            title="Clear search"
                        >
                            <X size={16} />
                        </button>
                    )}
                    {isSearching && searchQuery.length >= 2 && (
                        <div className="absolute -right-8 top-1/2 -translate-y-1/2">
                            <Loader2 className="animate-spin text-primary size-4" />
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="relative w-full sm:w-48">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground size-4 pointer-events-none" />
                        <select
                            value={statusFilter}
                            onChange={(e) => {
                                setStatusFilter(e.target.value)
                                setCurrentPage(1)
                            }}
                            className="flex h-10 w-full rounded-md border border-input bg-white pl-9 pr-3 py-2 text-sm  disabled:cursor-not-allowed disabled:opacity-50 appearance-none cursor-pointer hover:border-primary/50 transition-colors"
                        >
                            <option value="">All Projects</option>
                            <option value="ACTIVE">Active</option>
                            <option value="COMPLETED">Completed</option>
                            <option value="ARCHIVED">Archived</option>
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none border-l pl-2 border-input">
                            <svg className="size-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            <div className='flex flex-col justify-between min-h-[400px]'>
                {isLoading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="flex flex-col items-center gap-4">
                            <Loader2 className="animate-spin text-primary size-10" />
                            <p className="text-muted-foreground animate-pulse">Loading projects...</p>
                        </div>
                    </div>
                ) : isError ? (
                    <div className="text-center py-12 bg-destructive/5 rounded-xl border border-destructive/20 text-destructive">
                        <p className="font-semibold text-lg">Failed to load projects</p>
                        <p className="text-sm opacity-90">Please try again later or contact support if the issue persists.</p>
                    </div>
                ) : projects.length === 0 ? (
                    <div className="text-center py-16 bg-muted/30 rounded-2xl border-2 border-dashed border-muted flex flex-col items-center justify-center space-y-3">
                        <Search className="size-12 text-muted-foreground/30" />
                        <div className="space-y-1">
                            <h3 className="text-xl font-semibold text-foreground">No projects found</h3>
                            <p className="text-muted-foreground max-w-xs mx-auto">
                                {searchQuery.length >= 2
                                    ? `We couldn't find any projects matching "${searchQuery}".`
                                    : "You haven't added any projects yet or your search query is too short."}
                            </p>
                        </div>
                        {searchQuery && (
                            <Button variant="outline" size="sm" onClick={() => setSearchQuery('')}>
                                Reset Search
                            </Button>
                        )}
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {projects.map((project) => (
                                <ProjectCard
                                    key={project.id}
                                    project={project}
                                    isAdmin={isAdmin}
                                    onEdit={handleEditProject}
                                    onArchive={(p) => {
                                        setProjectToArchive(p)
                                        setIsArchiveModalOpen(true)
                                    }}
                                />
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <div className="flex items-center justify-end gap-2 mt-8">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                >
                                    Previous
                                </Button>
                                <span className="text-sm font-medium mx-2">
                                    Page {currentPage} of {totalPages}
                                </span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                >
                                    Next
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </div>


            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false)
                    setEditingProject(null)
                }}
                title={editingProject ? "Edit Project" : "New Project"}
            >
                <ProjectForm
                    initialData={editingProject || undefined}
                    onSubmit={handleSaveProject}
                    onCancel={() => {
                        setIsModalOpen(false)
                        setEditingProject(null)
                    }}
                />
            </Modal>

            <ConfirmModal
                isOpen={isArchiveModalOpen}
                onClose={() => setIsArchiveModalOpen(false)}
                onConfirm={handleArchiveConfirm}
                title="Archive Project"
                description={`Are you sure you want to archive "${projectToArchive?.name}"? This will hide it from the active projects list.`}
                confirmText="Archive"
                variant="danger"
                isLoading={archiveProjectMutation.isPending}
            />
        </div>
    )
}
