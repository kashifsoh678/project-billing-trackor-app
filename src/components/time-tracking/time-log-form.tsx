'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, DefaultValues } from 'react-hook-form'

import { TimeLogStatus, TimeLog, Role } from '@/types'
import { TimeLogInput, timeLogSchema } from '@/lib/validators'
import { useAuth } from '@/context/auth-context'

type TimeLogFormValues = TimeLogInput

interface TimeLogFormProps {
    projectId: string
    initialData?: TimeLog
    onSubmit: (data: TimeLogFormValues) => void
    onCancel?: () => void
}

const TimeLogForm = ({ projectId, initialData, onSubmit, onCancel }: TimeLogFormProps) => {
    const { user } = useAuth()
    const isEmployee = user?.role === Role.EMPLOYEE

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<TimeLogFormValues>({
        // @ts-expect-error - zodResolver type mismatch with coerced fields
        resolver: zodResolver(timeLogSchema),
        defaultValues: (initialData ? {
            hours: initialData.hours,
            notes: initialData.notes || '',
            logDate: new Date(initialData.logDate).toISOString().split('T')[0] as unknown as Date,
            status: initialData.status,
            projectId: initialData.projectId,
        } : {
            hours: 1,
            notes: '',
            logDate: new Date().toISOString().split('T')[0] as unknown as Date,
            status: TimeLogStatus.TODO,
            projectId: projectId,
        }) as DefaultValues<TimeLogFormValues>,
        mode: 'onChange',
    })

    const handleFormSubmit = (data: TimeLogFormValues) => {
        onSubmit(data)
    }

    return (

        <form
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onSubmit={handleSubmit(handleFormSubmit as any)}
            className="space-y-4"
        >
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
                    max={new Date().toISOString().split('T')[0]}
                    error={errors.logDate?.message}
                    required
                    {...register('logDate')}
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
                    className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1 uppercase"
                    disabled={isEmployee && !initialData}
                    {...register('status')}
                >
                    <option value={TimeLogStatus.TODO}>Todo</option>
                    <option value={TimeLogStatus.IN_PROGRESS}>In Progress</option>
                    <option value={TimeLogStatus.DONE}>Done</option>
                </select>
                {isEmployee && !initialData && (
                    <p className="text-[10px] text-muted-foreground mt-1">Status defaults to TODO for new logs</p>
                )}
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
                <Button type="submit" size='sm' disabled={isSubmitting}>
                    {isSubmitting ? 'Processing...' : (initialData ? 'Update Log' : 'Save Log')}
                </Button>
            </div>
        </form >

    )
}

export default TimeLogForm
