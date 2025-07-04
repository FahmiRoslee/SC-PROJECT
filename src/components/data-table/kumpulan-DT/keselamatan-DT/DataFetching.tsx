import { AhliPengakap } from "./columns";

export async function getData(): Promise<AhliPengakap[]> {
  return [
    {
      id: "1",
      profilePic: "../../../public/sk-peserai.png",
      name: "Muhammad Falihin Bin Kamari",
      noId: "890421-01-5081",
      unit: "PEMIMPIN",
      status: "Active"
    },
    {
      id: "2",
      profilePic: "../../../public/sk-peserai.png",
      name: "Md. Osman Bin Abdullah",
      noId: "890421-01-5081",
      unit: "PEMIMPIN",
      status: "Active"
    },
    {
      id: "3",
      profilePic: "../../../public/sk-peserai.png",
      name: "Nur Syafiyah Binti Sazali",
      noId: "890421-01-5081",
      unit: "PKK",
      status: "Inactive"
    },

  ]
}