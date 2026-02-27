import { BarChart3, Clock, LayoutGrid, CheckCircle2 } from 'lucide-react'
import Card from '@/components/ui/Card'

const metadata = [
    { icon: BarChart3, label: 'Skill level', value: 'Academic' },
    { icon: Clock, label: 'Time to prepare', value: 'Varied' },
    { icon: LayoutGrid, label: 'Exam types', value: '3 Major' },
    { icon: CheckCircle2, label: 'Quality', value: 'Verified' },
]

export default function MetadataStrip() {
    return (
        <Card size="none" noHover className="p-0 overflow-hidden divide-y md:divide-y-0 md:divide-x divide-[#111827]">
            <div className="grid grid-cols-1 md:grid-cols-4 w-full">
                {metadata.map(({ icon: Icon, label, value }) => (
                    <div key={label} className="p-6 flex items-center gap-5 transition-colors hover:bg-black/5">
                        <div className="w-12 h-12 rounded-sm border border-[#111827] flex items-center justify-center bg-[#EAE0D5]">
                            <Icon className="w-6 h-6 text-[#111827]" />
                        </div>
                        <div>
                            <p className="text-[#6B7280] text-xs font-mono uppercase tracking-widest mb-1">
                                {label}
                            </p>
                            <p className="text-[#111827] text-lg font-bold uppercase tracking-tight">
                                {value}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    )
}
