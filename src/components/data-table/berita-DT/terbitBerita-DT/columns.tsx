"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "../../../ui/checkbox"
import { Button } from "../../../ui/button"

import { ArrowUpDown, ChevronDown, Eye,Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"


// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type TerbitBerita = {
  id: string
  newsImg: string
  title: string
  createdAt: string
  status: string
}

export const columns: ColumnDef<TerbitBerita>[] = [

  // GAMBAR BERITA
  {
    accessorKey: "newsImg",
    header: "",
    cell: ({ row }) => (
      row.original.newsImg ? (
        <img
          src={row.original.newsImg}
          
          className="w-10 h-10 rounded-full object-cover"
        />
      ) : (
        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-red-300 text-xs font-bold uppercase">
          {row.original.title ? row.original.title.charAt(0) : "?"}
        </div>
      )
    )
    
  },

  // TAJUK BERITA
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          // className="w-"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Tajuk Berita
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="uppercase font-normal  font-sans">
        {row.getValue("title")}
      </div>
    ),  },

  // TARIKH TERBITAN
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Tarikh Terbitan
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="uppercase font-sans font-normal">{row.getValue("createdAt")}</div>,
  },

  // STATUS
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="uppercase">{row.getValue("status")}</div>,
  },

  // ACTION BUTTON
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const payment = row.original
 
      return (
        <div className="flex">

          {/* EDIT  BUTTON */}
          <button 
            onClick={() => console.log()}
            className="group mr-2 h-[32px] w-[32px] flex items-center justify-center border border-gray-600 rounded-sm 
                      text-gray-600 active:scale-95 cursor-pointer hover:bg-gray-100">
            <Eye 
              color="currentColor" 
              size={18} 
              strokeWidth={1.5}
              className="transition-all duration-200 group-hover:fill-current group-hover:text-gray-800"
              fill="none" 
            />
          </button>


          {/* DELETE BUTTON */}
          <button 
            onClick={() => console.log()}
            className="h-[32px] w-[32px] flex items-center justify-center border border-[#DC3545] rounded-sm 
                      text-[#DC3545] hover:bg-[#DC3545] hover:text-white active:scale-95 transition-all duration-200 cursor-pointer">
            <Trash2 
              color="currentColor" 
              size={18} 
              strokeWidth={1.5} 
            />
          </button>
        </div>

      )
    },  
  },
]
