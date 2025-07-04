"use client"

import { useState } from "react"
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover"

import { Command, CommandGroup, CommandItem } from "../ui/command"
import { Button } from "../ui/button"
import { Check, ChevronDown, LogOut } from "lucide-react"
import { SidebarTrigger } from "./sidebar"

const teams = [
  { name: "Muhammad Falihin Bin Kamari", type: "Personal Account" },
  { name: "SK Temenggong Ibrahim Penggaram", type: "Teams" },
  { name: "Sk Perserai", type: "Teams" },
]

const handleLogout = () => {
  console.log("Logging out...")
}

export default function Header({}) {
  console.log("Header rendered")

  const [selectedTeam, setSelectedTeam] = useState(teams[0])

  return (
    <header className="flex items-center justify-between w-full h-auto border-t border-b border-[#CED4DA] py-3 px-4 transition-all duration-200 ease-linear">
      {/* ROLE SWITCHER */}
      <div className="flex items-center z-40 relative">
        <SidebarTrigger className="mr-4" />
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2 px-4 py-2 w-[270px] justify-between">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 bg-gray-500 rounded-full"></span>
                <span className="truncate max-w-[180px]">{selectedTeam.name}</span>
              </div>
              <ChevronDown size={16} />
            </Button>
          </PopoverTrigger>

          <PopoverContent side="bottom" align="start" className="w-[270px] p-2">
            <Command>
              {/* SEARCH BAR */}
              {/* <CommandInput placeholder="Search team..." /> */}

              {/* PERSONAL */}
              <CommandGroup heading="Personal">
                {teams
                  .filter((team) => team.type === "Personal Account")
                  .map((team) => (
                    <CommandItem
                      key={team.name}
                      onSelect={() => setSelectedTeam(team)}
                      className="flex justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 bg-gray-500 rounded-full"></span>
                        {team.name}
                      </div>
                      {selectedTeam.name === team.name && <Check size={16} />}
                    </CommandItem>
                  ))}
              </CommandGroup>

              {/* KUMPULAN */}
              <CommandGroup heading="Kumpulan">
                {teams
                  .filter((team) => team.type === "Teams")
                  .map((team) => (
                    <CommandItem
                      key={team.name}
                      onSelect={() => setSelectedTeam(team)}
                      className="flex justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 bg-gray-500 rounded-full"></span>
                        {team.name}
                      </div>
                      {selectedTeam.name === team.name && <Check size={16} />}
                    </CommandItem>
                  ))}
              </CommandGroup>

              {/* <CommandItem className="flex items-center gap-2 px-3 py-2 text-gray-200 cursor-pointer">
                    <Plus size={16} /> Create Team
                </CommandItem> */}
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {/* LOGOUT BUTTON */}
      <div className="mr-4">
        <Button
          variant="outline"
          className="flex items-center gap-2 text-red-500 hover:bg-red-500 hover:text-white"
          onClick={handleLogout}
        >
          <LogOut size={18} />
          Logout
        </Button>
      </div>
    </header>
  )
}
