"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { fetchTeamById } from "@/lib/fetchTeamById";

type TeamData = {
  id: string;
  kumpImage: string;
  kumpName: string;
  kumpNo: string;
  noM: string;
  daerah: string;
  negeri: string;
};

const TeamDataContext = createContext<TeamData | null>(null);

export function useTeamData() {
  return useContext(TeamDataContext);
}

export function TeamDataProvider({ children }: { children: React.ReactNode }) {
  
    const [teamData, setTeamData] = useState<TeamData | null>(null);
    const searchParams = useSearchParams();
    const teamId = searchParams?.get("id");

    useEffect(() => {
        const fetchData = async () => {
        if (teamId) {
            const data = await fetchTeamById(teamId);
            setTeamData(data);
        }
        };

        fetchData();
    }, [teamId]);

  return (
    <TeamDataContext.Provider value={teamData}>
      {children}
    </TeamDataContext.Provider>
  );
}
