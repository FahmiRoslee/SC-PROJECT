import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setSignatureFile,
} from "@components/lib/redux/permohonanTauliah/permohonanTauliahSlice";


import { FileInputField } from "../ui/customInputFeild";
import { RootState } from "@components/lib/store";

const Step7: React.FC = () => {
  const dispatch = useDispatch();

  // ✅ Get the file from Redux
  const signatureFile = useSelector((state: RootState) => state.permohonanTauliah.signatureFile);

  const handleFileChange = (file: File | null) => {
    if (file) {
      dispatch(setSignatureFile(file));
    }
  };

  return (
    <div className="space-y-6 mt-5 px-8 py-4 border border-gray-400 rounded-md">
      <h3 className="mb-6 font-sans font-semibold">
        <span className="mr-1">7. </span>Pengakuan
      </h3>

      <p className="uppercase font-sans font-normal mb-15">
        SAYA SESUNGGUHNYA MENGAKU BAHAWA SEMUA KETERANGAN YANG TELAH SAYA BERIKAN DI DALAM BORANG INI ADALAH BENAR DAN BETUL.<br />
        SAYA MEMAHAMI BAHAWA SEKIRANYA ADA DIANTARA MAKLUMAT-MAKLUMAT ITU DIDAPATI PALSU, MAKA PIHAK PERSEKUTUAN PENGAKAP MALAYSIA <br />
        BERHAK MENARIK BALIK TAULIAH YANG DIBERIKAN DAN PERKHIDMATAN SAYA AKAN DITAMATKAN DENGAN SERTA MERTA.
      </p>

      {/* SALINAN TANDATANGAN FILE */}
      <FileInputField
        id="salinanTandatanganFile"
        label="Salinan Tandatangan"
        required
        acceptedFormats={["pdf", "png", "jpeg", "jpg"]}
        onFileChange={handleFileChange}
        value={signatureFile?.name} // ✅ Show file name from Redux
      />
    </div>
  );
};

export default Step7;
