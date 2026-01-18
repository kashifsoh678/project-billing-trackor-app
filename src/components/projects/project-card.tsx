import React from 'react'
import Link from 'next/link'
import { MoreHorizontal, Clock, DollarSign } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

import { Project } from '@/types'

interface ProjectCardProps {
    project: Project
    isAdmin?: boolean
    onEdit: (project: Project) => void
    onArchive: (project: Project) => void
}

const ProjectCard = ({ project, isAdmin, onEdit, onArchive }: ProjectCardProps) => {
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

    const statusColors: Record<string, string> = {
        ACTIVE: 'bg-green-100 text-green-700 ',
        COMPLETED: 'bg-blue-100 text-blue-700  ',
        ARCHIVED: 'bg-gray-100 text-gray-700  ',
    }

    return (
        <div className="relative group block h-full">
            <Link href={`/projects/${project.id}`} className="block h-full">
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
                            <span className="font-medium text-foreground">${project.billingRate}/hr</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Clock size={16} />
                            <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                        </div>
                    </CardFooter>
                </Card>
            </Link>

            {isAdmin && project.status !== 'ARCHIVED' && (
                <div className="absolute top-4 right-4 z-10" ref={menuRef}>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-muted-foreground hover:bg-muted"
                        onClick={(e) => {
                            e.preventDefault()
                            setShowMenu(!showMenu)
                        }}
                    >
                        <MoreHorizontal size={18} />
                    </Button>

                    {showMenu && (
                        <div className="absolute right-0 mt-1 w-32 rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in fade-in-0 zoom-in-95">
                            <div className="flex flex-col p-1">
                                <button
                                    className="relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground text-left"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        onEdit(project)
                                        setShowMenu(false)
                                    }}
                                >
                                    Edit
                                </button>
                                <button
                                    className="relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground text-left text-destructive"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        onArchive(project)
                                        setShowMenu(false)
                                    }}
                                >
                                    Archive
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default ProjectCard
