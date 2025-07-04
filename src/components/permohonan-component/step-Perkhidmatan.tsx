// Step4.tsx
import React from "react";
import { TextInputField } from "../ui/customInputFeild";
import ManikayuDT from "../data-table/maklumatPeribadi-DT/pengakap-manikayu-DT/manikayuDT";       // Adjust the import path as needed
import { Label } from "@radix-ui/react-dropdown-menu";

const Step4: React.FC = () => {
  return (
    <div className="space-y-6 mt-5 px-8 py-4 border border-gray-400 rounded-md">
      <h3 className="mb-6 font-sans font-semibold">
        <span className="mr-1">4. </span>
        Maklumat Perkhidmatan Dalam Persekutuan Pengakap Malaysia
      </h3>

      <div className="flex w-full gap-5">
        {/* NO KEAHLIAN */}
        <TextInputField
          id="noKeahlian"
          label="No. Keahlian"
          value="71 tahun"
          readOnly
          className="bg-muted"
        />

        {/* JAWATAN TERTINGGI */}
        <TextInputField
          id="jawatanTertinggi"
          label="Jawatan Tertinggi"
          value="71 tahun"
          readOnly
          className="bg-muted"
        />
      </div>

      <Label className="font-sans font-medium">Senarai Manikayu</Label>
      <ManikayuDT editable={true} />

      <Label className="font-sans font-medium">Senarai Jawatan</Label>
    </div>
  );
};

export default Step4;
