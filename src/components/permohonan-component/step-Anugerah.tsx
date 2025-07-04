// Step5.tsx
import React from "react";
import AnugerahDT from "../data-table/maklumatPeribadi-DT/pengakap-anugerah-DT/anugerahDT";       // Adjust the import path as needed
import { Label } from "@radix-ui/react-dropdown-menu";

const Step5: React.FC = () => {
  return (
    <div className="space-y-6 mt-5 px-8 py-4 border border-gray-400 rounded-md">
      <h3 className="mb-6 font-sans font-semibold">
        <span className="mr-1">5. </span>
        Maklumat Anugerah Yang Diperolehi (Tertinggi)
      </h3>

      <Label className="font-sans font-medium">
        Anugerah Daripada Persekutuan Pengakap Malaysia
      </Label>
      <AnugerahDT editable={true} award_type="PPM" />

      <Label className="font-sans font-medium">
        Anugerah Kepengakapan Daripada Negara Luar
      </Label>
      <AnugerahDT editable={true} award_type="nonPPM" />
    </div>
  );
};

export default Step5;
