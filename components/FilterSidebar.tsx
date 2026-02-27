'use client'

import React from 'react'
import { FilterState } from '@/app/explore/page'
import { departments, subjects } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

interface FilterSidebarProps {
    filters: FilterState
    onChange: (filters: FilterState) => void
}

export default function FilterSidebar({ filters, onChange }: FilterSidebarProps) {
    const years = ['2024', '2023', '2022', '2021', '2020']
    const semesters = [1, 2, 3, 4, 5, 6, 7, 8]
    const examCategories = ['CAT-1', 'CAT-2', 'FAT']

    const updateFilter = (key: keyof FilterState, value: string) => {
        onChange({ ...filters, [key]: filters[key] === value ? '' : value })
    }

    const FilterSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
        <div className="mb-10 last:mb-0">
            <h4 className="text-[10px] font-mono font-black text-[#111827] uppercase tracking-[0.2em] mb-4 pb-2 border-b border-[#111827]/10">
                {title}
            </h4>
            <div className="flex flex-col gap-2">
                {children}
            </div>
        </div>
    )

    const FilterButton = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => (
        <button
            onClick={onClick}
            className={cn(
                "flex items-center justify-between px-3 py-2 text-xs font-bold uppercase tracking-tight text-left transition-all duration-150 border rounded-sm",
                active
                    ? "bg-[#111827] text-white border-[#111827] translate-x-1"
                    : "bg-white text-[#6B7280] border-[#111827]/10 hover:border-[#111827] hover:text-[#111827]"
            )}
        >
            {children}
            {active && <span className="w-1.5 h-1.5 rounded-full bg-[#4338CA] animate-pulse" />}
        </button>
    )

    return (
        <div className="p-1">
            <FilterSection title="Examination Tier">
                {examCategories.map((type) => (
                    <FilterButton
                        key={type}
                        active={filters.examType === type}
                        onClick={() => updateFilter('examType', type)}
                    >
                        {type}
                    </FilterButton>
                ))}
            </FilterSection>

            <FilterSection title="Academic Year">
                <div className="grid grid-cols-2 gap-2">
                    {years.map((year) => (
                        <FilterButton
                            key={year}
                            active={filters.year === year}
                            onClick={() => updateFilter('year', year)}
                        >
                            {year}
                        </FilterButton>
                    ))}
                </div>
            </FilterSection>

            <FilterSection title="Department">
                {departments.map((dept) => (
                    <FilterButton
                        key={dept.id}
                        active={filters.department === dept.shortName}
                        onClick={() => updateFilter('department', dept.shortName)}
                    >
                        {dept.shortName}
                    </FilterButton>
                ))}
            </FilterSection>

            <FilterSection title="Semester">
                <div className="grid grid-cols-4 gap-2">
                    {semesters.map((sem) => (
                        <FilterButton
                            key={sem}
                            active={filters.semester === String(sem)}
                            onClick={() => updateFilter('semester', String(sem))}
                        >
                            {sem}
                        </FilterButton>
                    ))}
                </div>
            </FilterSection>
        </div>
    )
}
