import React, { useEffect, useState } from "react";
import { supabase } from "@components/lib/supabaseClient";
import { getCachedUser } from "@components/lib/utils";
import { johorDaerahList } from "@components/lib/utils";
import { Button } from "../ui/button";
import AkademikDT from "../data-table/maklumatPeribadi-DT/pengakap-akademik-DT/akademikDT";
import { DropdownField, TextInputField } from "../ui/customInputFeild";

// Define the shape of the form data for better type safety
interface Step3FormData {
  jawatanHakiki: string;
  namaMajikan: string;
  alamatMajikan: string;
  daerahMajikan: string;
  poskodMajikan: string;
  negeriMajikan: string;
}

interface Step3Props {
  userData: any;
}

const Step3: React.FC<Step3Props> = ({ userData: initialUserData }) => {
  const [formData, setFormData] = useState<Step3FormData>({
    jawatanHakiki: "",
    namaMajikan: "",
    alamatMajikan: "",
    daerahMajikan: "",
    poskodMajikan: "",
    negeriMajikan: "",
  });

  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (initialUserData) {
      setFormData({
        jawatanHakiki: initialUserData.jawatanHakiki || "",
        namaMajikan: initialUserData.namaMajikan || "",
        alamatMajikan: initialUserData.alamatMajikan || "",
        daerahMajikan: initialUserData.daerahMajikan || "",
        poskodMajikan: initialUserData.poskodMajikan || "",
        negeriMajikan: initialUserData.negeriMajikan || "",
      });
    }
  }, [initialUserData]);

  useEffect(() => {
    if (!initialUserData) return;

    let changesDetected = false;
    const changedFields: { [key: string]: { old: any; new: any } } = {};

    const editableFields: Array<keyof Step3FormData> = [
      "jawatanHakiki",
      "namaMajikan",
      "alamatMajikan",
      "daerahMajikan",
      "poskodMajikan",
      "negeriMajikan",
    ];

    editableFields.forEach((field) => {
      const initialValue = initialUserData[field];
      if (formData[field] !== initialValue) {
        changesDetected = true;
        changedFields[field] = { old: initialValue, new: formData[field] };
      }
    });

    setHasChanges(changesDetected);

    if (changesDetected) {
      console.log("Changes detected in form data:", changedFields);
    } else {
      console.log("No changes detected in form data.");
    }
  }, [formData, initialUserData]);

  const handleChange = (field: keyof Step3FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    const user = await getCachedUser();
    if (!user) {
      console.error("No user found.");
      setIsSaving(false);
      return;
    }

    try {
      const { error: userUpdateError } = await supabase
        .from("user_occupation")
        .update({
          occupation: formData.jawatanHakiki,
          employer_address: formData.alamatMajikan,
          employer_postcode: formData.poskodMajikan,
          employer_district: formData.daerahMajikan,
          employer_state: formData.negeriMajikan,
        })
        .eq("user_id", user.id);

      if (userUpdateError) {
        throw userUpdateError;
      }

      alert("Maklumat peribadi berjaya dikemaskini!");
    } catch (error: any) {
      console.error("Error saving data:", error.message);
      console.error("for id:", user.id);
      alert("Gagal mengemaskini maklumat: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 mt-5 px-8 py-4 border border-gray-400 rounded-md">
      <h3 className="font-sans font-semibold">
        <span className="mr-1">3. </span>Maklumat Akademik dan Pekerjaan
      </h3>

      <AkademikDT editable={true} />

      <div className="flex w-full gap-5">
        <TextInputField
          id="jawatanHakiki"
          label="Jawatan Hakiki"
          value={formData.jawatanHakiki}
          onChange={(e) => handleChange("jawatanHakiki", e.target.value)}
          required
        />
        <TextInputField
          id="namaMajikan"
          label="Nama Majikan"
          value={formData.namaMajikan}
          onChange={(e) => handleChange("namaMajikan", e.target.value)}
          required
        />
      </div>

      <TextInputField
        id="alamatMajikan"
        label="Alamat Majikan"
        placeholder="Alamat Majikan"
        value={formData.alamatMajikan}
        onChange={(e) => handleChange("alamatMajikan", e.target.value)}
        required
      />

      <div className="flex w-full gap-5">
        <TextInputField
          id="poskodMajikan"
          label="Poskod"
          placeholder="Poskod"
          value={formData.poskodMajikan}
          onChange={(e) => handleChange("poskodMajikan", e.target.value)}
          required
          type="number"
        />

        <DropdownField
          id="daerahMajikan"
          label="Daerah"
          placeholder="Daerah"
          options={johorDaerahList}
          value={formData.daerahMajikan}
          onValueChange={(value) => handleChange("daerahMajikan", value)}
          required
        />

        <TextInputField
          id="negeriMajikan"
          label="Negeri"
          placeholder="Negeri"
          value={formData.negeriMajikan}
          onChange={(e) => handleChange("negeriMajikan", e.target.value)}
          required
        />
      </div>

      <div className="flex justify-end mt-4">
        <Button onClick={handleSave} disabled={!hasChanges || isSaving}>
          {isSaving ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  );
};

export default Step3;
