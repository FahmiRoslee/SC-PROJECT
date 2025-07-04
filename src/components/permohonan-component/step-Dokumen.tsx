import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setSijilManikayuFile,
  setSalinanICFile,
  setKadKeahlianPengakapFile,
} from "@components/lib/redux/permohonanTauliah/permohonanTauliahSlice";
import { FileInputField } from "../ui/customInputFeild";
import { RootState } from "@/redux/store"; // adjust the import path if needed

const Step6: React.FC = () => {
  const dispatch = useDispatch();

  // ✅ Get file state from Redux
  const {
    sijilManikayuFile,
    salinanICFile,
    kadKeahlianPengakapFile,
  } = useSelector((state: RootState) => state.permohonanTauliah);

  const handleFileChange = (
    file: File | null,
    key: "ic" | "sijil" | "keahlian"
  ) => {
    if (file) {
      switch (key) {
        case "sijil":
          dispatch(setSijilManikayuFile(file));
          break;
        case "ic":
          dispatch(setSalinanICFile(file));
          break;
        case "keahlian":
          dispatch(setKadKeahlianPengakapFile(file));
          break;
        default:
          break;
      }
    }
  };

  return (
    <div className="space-y-6 mt-5 px-8 py-4 border border-gray-400 rounded-md">
      <h3 className="mb-6 font-sans font-semibold">
        <span className="mr-1">6. </span>Dokumen Sokongan
      </h3>

      {/* SIJIL MANIKAYU FILE */}
      <FileInputField
        id="sijilManikayuFile"
        label="Sijil Manikayu"
        required
        acceptedFormats={["pdf", "png", "jpeg", "jpg"]}
        onFileChange={(file) => handleFileChange(file, "sijil")}
        value={sijilManikayuFile?.name ?? ""}
      />

      {/* SALINAN IC FILE */}
      <FileInputField
        id="salinanICFile"
        label="Salinan Kad Pengenalan"
        required
        acceptedFormats={["pdf", "png", "jpeg", "jpg"]}
        onFileChange={(file) => handleFileChange(file, "ic")}
        value={salinanICFile?.name ?? ""}
      />

      {/* KAD KEAHLIAN FILE */}
      <FileInputField
        id="kadKeahlianFile"
        label="Kad Keahlian Pengakap"
        required
        acceptedFormats={["pdf", "png", "jpeg", "jpg"]}
        onFileChange={(file) => handleFileChange(file, "keahlian")}
        value={kadKeahlianPengakapFile?.name ?? ""}
      />
    </div>
  );
};

export default Step6;
