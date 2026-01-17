import React from 'react'
import Link from 'next/link'
import { MoreHorizontal, Clock, DollarSign } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface Project {
    id: string
    name: string
    description: string
    billing_rate: number
    status: 'active' | 'completed' | 'archived'
    created_at: string
}

const ProjectCard = ({ project }: { project: Project }) => {
    const statusColors = {
        active: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
        completed: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
        archived: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
    }

    return (
        <Link href={`/projects/${project.id}`} className="block group">
            <Card className="h-full transition-all duration-200 hover:shadow-md hover:border-primary/50">
                <CardHeader className="pb-3">
                    <div className="flex justify-between items-start gap-4">
                        <div className="space-y-1">
                            <CardTitle className="text-xl group-hover:text-primary transition-colors">
                                {project.name}
                            </CardTitle>
                            <div
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${statusColors[project.status]
                                    }`}
                            >
                                {project.status}
                            </div>
                        </div>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground">
                            <MoreHorizontal size={18} />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="pb-3">
                    <p className="text-sm text-muted-foreground line-clamp-2 min-h-10">
                        {project.description}
                    </p>
                </CardContent>
                <CardFooter className="pt-3 border-t border-border flex justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                        <DollarSign size={16} className="text-primary" />
                        <span className="font-medium text-foreground">${project.billing_rate}/hr</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Clock size={16} />
                        <span>{new Date(project.created_at).toLocaleDateString()}</span>
                    </div>
                </CardFooter>
            </Card>
        </Link>
    )
}

export default ProjectCard
