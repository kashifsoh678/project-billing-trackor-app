'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { TimeLog } from '../kanban/kanban-board'

const timeLogSchema = z.object({
    hours: z.coerce
        .number()
        .min(0.1, 'Hours must be at least 0.1')
        .max(12, 'Total hours per day cannot exceed 12'),
    notes: z.string().min(5, 'Notes must be at least 5 characters'),
    log_date: z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: 'Invalid date',
    }),
    status: z.enum(['todo', 'in-progress', 'done']),
})

type TimeLogFormValues = z.infer<typeof timeLogSchema>

interface TimeLogFormProps {
    initialData?: TimeLogFormValues
    onSubmit: (data: TimeLogFormValues) => void
    onCancel?: () => void
    onDelete: (log: TimeLog) => void
}

const TimeLogForm = ({ initialData, onSubmit, onCancel, onDelete }: TimeLogFormProps) => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<TimeLogFormValues>({
        // @ts-expect-error - zodResolver type mismatch with coerce.number()
        resolver: zodResolver(timeLogSchema),
        defaultValues: initialData || {
            hours: 1,
            notes: '',
            log_date: new Date().toISOString().split('T')[0],
            status: 'todo',
        },
        mode: 'onChange',
    })

    // Mock submission delay
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleFormSubmit = async (data: any) => {
        await new Promise((resolve) => setTimeout(resolve, 500))
        onSubmit(data)
    }

    return (

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <Input
                    label="Hours"
                    type="number"
                    step="0.1"
                    error={errors.hours?.message}
                    required
                    {...register('hours')}
                />
                <Input
                    label="Date"
                    type="date"
                    error={errors.log_date?.message}
                    required
                    {...register('log_date')}
                />
            </div>

            <Textarea
                label="Notes"
                placeholder="Describe your work..."
                error={errors.notes?.message}
                required
                {...register('notes')}
            />

            <div className="space-y-1.5">
                <label className="text-sm font-medium leading-none">Status</label>
                <select
                    className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1"
                    {...register('status')}
                >
                    <option value="todo">Todo</option>
                    <option value="in-progress">In Progress</option>
                    <option value="done">Done</option>
                </select>
                {errors.status && (
                    <p className="text-xs font-medium text-destructive">{errors.status.message}</p>
                )}
            </div>

            <div className="flex gap-3 justify-end pt-2">
                {onCancel && (
                    <Button type="button" size='sm' variant="outline" onClick={onCancel}>
                        Cancel
                    </Button>
                )}
                {initialData && onDelete && (
                    <Button type="button" size='sm' variant="destructive" onClick={() => onDelete(initialData as TimeLog)}>
                        Delete
                    </Button>
                )}
                <Button type="submit" size='sm' disabled={isSubmitting}>
                    {initialData ? 'Update Log' : 'Save Log'}
                </Button>
            </div>
        </form>

    )
}

export default TimeLogForm
