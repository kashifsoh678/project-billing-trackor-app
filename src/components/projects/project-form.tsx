'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

const projectSchema = z.object({
    name: z.string().min(1, 'Project name is required'),
    description: z.string().optional(),
    billing_rate: z.coerce.number().min(0, 'Billing rate must be positive'),
    status: z.enum(['active', 'completed', 'archived']).default('active'),
})

type ProjectFormValues = z.infer<typeof projectSchema>

interface ProjectFormProps {
    initialData?: ProjectFormValues
    onSubmit: (data: ProjectFormValues) => void
    onCancel?: () => void
}

const ProjectForm = ({ initialData, onSubmit, onCancel }: ProjectFormProps) => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ProjectFormValues>({
        // @ts-expect-error - zodResolver type mismatch with coerce.number()
        resolver: zodResolver(projectSchema),
        defaultValues: initialData || {
            name: '',
            description: '',
            billing_rate: 0,
            status: 'active',
        },
    })

    const handleFormSubmit = async (data: ProjectFormValues) => {
        // Mock submission delay
        await new Promise((resolve) => setTimeout(resolve, 500))
        onSubmit(data)
    }

    return (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        <form onSubmit={handleSubmit(handleFormSubmit as any)} className="space-y-4">
            <Input
                label="Project Name"
                placeholder="e.g. Website Redesign"
                error={errors.name?.message}
                required
                {...register('name')}
            />

            <Textarea
                label="Description"
                placeholder="Describe the project..."
                error={errors.description?.message}
                {...register('description')}
            />

            <div className="grid grid-cols-2 gap-4">
                <Input
                    label="Billing Rate ($/hr)"
                    type="number"
                    step="0.01"
                    error={errors.billing_rate?.message}
                    required
                    {...register('billing_rate')}
                />

                <div className="space-y-1.5">
                    <label className="text-sm font-medium leading-none">Status</label>
                    <select
                        className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1"
                        {...register('status')}
                    >
                        <option value="active">Active</option>
                        <option value="completed">Completed</option>
                        <option value="archived">Archived</option>
                    </select>
                </div>
            </div>

            <div className="flex gap-3 justify-end pt-2">
                {onCancel && (
                    <Button type="button" size='sm' variant="outline" onClick={onCancel}>
                        Cancel
                    </Button>
                )}
                <Button type="submit" size='sm' disabled={isSubmitting}>
                    {initialData ? 'Update Project' : 'Create Project'}
                </Button>
            </div>
        </form>
    )
}

export default ProjectForm
