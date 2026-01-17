'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign, Clock } from 'lucide-react'

interface BillingSummaryProps {
    totalHours: number
    billingRate: number
}

const BillingSummary = ({ totalHours, billingRate }: BillingSummaryProps) => {
    const totalCost = totalHours * billingRate

    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold">Billing Summary</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg border border-primary/10">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-full text-primary">
                                <Clock size={20} />
                            </div>
                            <span className="font-medium">Total Hours</span>
                        </div>
                        <span className="text-xl font-bold">{totalHours.toFixed(1)} hrs</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-green-500/5 rounded-lg border border-green-500/10 text-green-700 dark:text-green-400">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-500/10 rounded-full text-green-600 dark:text-green-400">
                                <DollarSign size={20} />
                            </div>
                            <span className="font-medium">Total Cost</span>
                        </div>
                        <span className="text-xl font-bold">${totalCost.toFixed(2)}</span>
                    </div>

                    <div className="pt-2 text-sm text-muted-foreground text-start border-t border-border mt-2">
                        Billing Rate: <span className="font-medium text-foreground">${billingRate}/hr</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default BillingSummary
