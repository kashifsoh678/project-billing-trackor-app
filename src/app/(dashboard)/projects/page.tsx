'use client'

import React from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import ProjectCard from '@/components/projects/project-card'

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
    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage your active projects and track billing.
                    </p>
                </div>
                <Button className="gap-2">
                    <Plus size={18} />
                    New Project
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {MOCK_PROJECTS.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                ))}
            </div>
        </div>
    )
}
