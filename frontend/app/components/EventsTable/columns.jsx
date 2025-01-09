"use client"

import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"
import { CopyIcon } from "lucide-react"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip"
import { toast } from "@/hooks/use-toast"

export const columns = [
    {
        accessorKey: "data_type",
        header: "Data Type",
    },
    {
        accessorKey: "event_type",
        header: "Event Type",
    },
    {
        accessorKey: "event_time",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Event Occurred At
                    <ArrowUpDown className="ml-2 h-4 w-4"/>
                </Button>
            )
        },
        cell: ({ row }) => {
            return new Date(row.getValue('event_time')).toLocaleString("en-US")
        }
    },
    {
        accessorKey: "object_id",
        header: "Object Id",
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const objectId = row.getValue('object_id')
            return (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger onClick={() => {
                            navigator.clipboard.writeText(objectId)
                            toast({
                                title: "Copied Object Id",
                                description: "Successfully copied!",
                            })
                        }}>
                            <Button
                                variant="ghost"
                                onClick={() => navigator.clipboard.writeText(objectId)}
                                >
                                <CopyIcon />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Copy Object Id</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            )
        }
    }
]