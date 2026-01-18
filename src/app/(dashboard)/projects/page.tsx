'use client'

import React, { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import ProjectCard from '@/components/projects/project-card'
import Modal from '@/components/ui/modal'
import ProjectForm from '@/components/projects/project-form'

interface Project {
    id: string
    name: string
    description: string
    billing_rate: number
    status: 'active' | 'completed' | 'archived'
    created_at: string
}

const MOCK_PROJECTS = [
    {
        id: '1',
        name: 'Website Redesign',
        description: 'Complete overhaul of the corporate website including new branding and CMS integration.',
        billing_rate: 85,
        status: 'active' as const,
        created_at: '2025-01-15T10:00:00Z',
    },
    {
        id: '2',
        name: 'Mobile App Development',
        description: 'Native iOS and Android application for customer loyalty program.',
        billing_rate: 110,
        status: 'active' as const,
        created_at: '2025-01-10T14:30:00Z',
    },
    {
        id: '3',
        name: 'Internal Dashboard',
        description: 'Analytics dashboard for internal team to track KPIs and performance metrics.',
        billing_rate: 95,
        status: 'completed' as const,
        created_at: '2024-12-05T09:15:00Z',
    },
    {
        id: '4',
        name: 'API Migration',
        description: 'Migrating legacy REST API to GraphQL with improved documentation.',
        billing_rate: 120,
        status: 'active' as const,
        created_at: '2025-01-18T11:00:00Z',
    },
    {
        id: '5',
        name: 'SEO Optimization',
        description: 'Comprehensive SEO audit and implementation of on-page optimizations.',
        billing_rate: 75,
        status: 'archived' as const,
        created_at: '2024-11-20T16:45:00Z',
    },
]

export default function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingProject, setEditingProject] = useState<Project | null>(null)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleSaveProject = (data: any) => {
        if (editingProject) {
            // Update
            const updatedProjects = projects.map(p =>
                p.id === editingProject.id
                    ? { ...p, ...data }
                    : p
            )
            setProjects(updatedProjects)
        } else {
            // Create
            const newProject: Project = {
                id: Math.random().toString(36).substr(2, 9),
                created_at: new Date().toISOString(),
                status: 'active',
                ...data,
            }
            setProjects([newProject, ...projects])
        }
        setIsModalOpen(false)
        setEditingProject(null)
    }

    const handleEditProject = (project: Project) => {
        setEditingProject(project)
        setIsModalOpen(true)
    }

    const handleArchiveProject = (project: Project) => {
        if (confirm('Are you sure you want to archive this project?')) {
            const updatedProjects = projects.map(p =>
                p.id === project.id
                    ? { ...p, status: 'archived' as const }
                    : p
            )
            setProjects(updatedProjects)
        }
    }

    const [currentPage, setCurrentPage] = useState(1)
    const ITEMS_PER_PAGE = 4

    const totalPages = Math.ceil(projects.length / ITEMS_PER_PAGE)
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const currentProjects = projects.slice(startIndex, startIndex + ITEMS_PER_PAGE)

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage)
        }
    }

    return (
        <div className="space-y-8 h-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage your active projects and track billing.
                    </p>
                </div>
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
            </div>

            <div className='flex flex-col justify-between'>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {currentProjects.map((project) => (
                        <ProjectCard
                            key={project.id}
                            project={project}
                            onEdit={handleEditProject}
                            onArchive={handleArchiveProject}
                        />
                    ))}
                </div>

                {totalPages > 1 && (
                    <div className="flex items-center justify-end gap-2 mt-4">
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
        </div>
    )
}
