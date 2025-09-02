'use client'
import { Button } from '@workspace/ui/components/button'
import { Input } from '@workspace/ui/components/input'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@workspace/ui/components/dropdown-menu'
import {
  useQueryState,
  parseAsArrayOf,
  parseAsStringEnum,
  parseAsString
} from 'nuqs'
import { Plus, Tag, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useDebounce } from '@uidotdev/usehooks'

type StatusValue = 'DRAFT' | 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'

interface StatusOption {
  value: StatusValue
  label: string
}

export const STATUS_OPTIONS: readonly StatusOption[] = [
  { value: 'DRAFT', label: 'Draft' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'PROCESSING', label: 'Processing' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'FAILED', label: 'Failed' }
] as const

const STATUS_VALUES = STATUS_OPTIONS.map((option) => option.value)

export function PlaylistFilters() {
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 300)

  const [, setDebouncedSearch] = useQueryState(
    'search',
    parseAsString.withDefault('')
  )

  const [status, setStatus] = useQueryState(
    'status',
    parseAsArrayOf(parseAsStringEnum(STATUS_VALUES), ',').withDefault(
      STATUS_VALUES
    )
  )

  function handleResetFilters() {
    setStatus(STATUS_VALUES)
  }

  useEffect(() => {
    setDebouncedSearch(debouncedSearch)
  }, [debouncedSearch, setDebouncedSearch])

  return (
    <div className="flex max-sm:flex-col sm:items-center gap-2 w-full">
      <Input
        onChange={(e) => setSearch(e.target.value)}
        value={search}
        placeholder="Search playlists..."
        className="sm:w-fit"
      />

      <div className="flex items-center gap-2 w-full">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" className="w-full sm:w-auto">
              <Tag className="size-4" /> Status
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Playlist Status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {STATUS_OPTIONS.map((item) => (
              <DropdownMenuCheckboxItem
                key={item.value}
                checked={status.includes(item.value)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setStatus([...status, item.value])
                  } else {
                    setStatus(status.filter((s) => s !== item.value))
                  }
                }}
              >
                {item.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          onClick={handleResetFilters}
          variant="outline"
          className="w-full sm:w-auto"
        >
          <X className="size-4" /> Reset
        </Button>

        <Button className="ml-auto">
          <Plus className="size-4" /> Nova Playlist
        </Button>
      </div>
    </div>
  )
}
