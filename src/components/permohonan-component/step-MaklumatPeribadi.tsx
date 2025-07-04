import React, { useEffect, useState } from "react";
import { Button } from "@components/components/ui/button"; // Adjust import paths as needed
import { Label } from "@components/components/ui/label";
import { supabase } from "@components/lib/supabaseClient";
import { getCachedUser } from "@components/lib/utils";
import { DropdownField, PhoneNumberField, TextInputField } from "../ui/customInputFeild";

interface Step2FormData {
  profileImage: string | null;
  namaPenuh: string;
  pangkat: string;
  statusPerkahwinan: string;
  ic: string;
  email: string;
  telefon: string;
  jantina: string;
  kaum: string;
  agama: string;
  tarikhLahir: string;
  umur: string;
  tempatLahir: string;
  alamatRumah: string;
  poskodRumah: string;
  daerahRumah: string;
  negeriRumah: string;
}

interface Step2Props {
  userData: any;
}

const Step2: React.FC<Step2Props> = ({ userData: initialUserData }) => {
  
  const statusPerkahwinanList = [
    { label: "Bujang", value: "Bujang" },
    { label: "Berkahwin", value: "Berkahwin" },
    { label: "Duda", value: "Duda" },
  ];

  const pangkatList = [
    { label: "Cik", value: "Cik" },
    { label: "Encik", value: "Encik" },
    { label: "Puan", value: "Puan" },
    { label: "Tun", value: "Tun" },
    { label: "Tan Sri", value: "Tan Sri" },
    { label: "Puan Sri", value: "Puan Sri" },
    { label: "Dato' Seri", value: "Dato' Seri" },
    { label: "Datin Seri", value: "Datin Seri" },
    { label: "Dato'", value: "Dato" },
    { label: "Datuk", value: "Datuk" },
    { label: "Datin", value: "Datin" },
  ];

  const [formData, setFormData] = useState<Step2FormData>({
    profileImage: null,
    namaPenuh: "",
    pangkat: "",
    statusPerkahwinan: "",
    ic: "",
    email: "",
    telefon: "",
    jantina: "",
    kaum: "",
    agama: "",
    tarikhLahir: "",
    umur: "",
    tempatLahir: "",
    alamatRumah: "",
    poskodRumah: "",
    daerahRumah: "",
    negeriRumah: "",
  });

  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (initialUserData) {
      setFormData({
        profileImage: initialUserData.profileImage || null,
        namaPenuh: initialUserData.namaPenuh || "",
        pangkat: initialUserData.pangkat || "",
        statusPerkahwinan: initialUserData.statusPerkahwinan || "",
        ic: initialUserData.ic || "",
        email: initialUserData.email || "",
        telefon: initialUserData.telefon || "",
        jantina: initialUserData.jantina || "",
        kaum: initialUserData.kaum || "",
        agama: initialUserData.agama || "",
        tarikhLahir: initialUserData.dob || "",
        umur: initialUserData.age || "",
        tempatLahir: initialUserData.tempatLahir || "",
        alamatRumah: initialUserData.alamatRumah || "",
        poskodRumah: initialUserData.poskodRumah || "",
        daerahRumah: initialUserData.daerahRumah || "",
        negeriRumah: initialUserData.negeriRumah || "",
      });
    }
  }, [initialUserData]);

  useEffect(() => {
    if (!initialUserData) return;

    let changesDetected = false;
    const changedFields: { [key: string]: { old: any; new: any } } = {};

    const editableFields: Array<keyof Step2FormData> = [
      "namaPenuh",
      "pangkat",
      "statusPerkahwinan",
      "telefon",
      "tempatLahir",
      "alamatRumah",
      "poskodRumah",
      "daerahRumah",
      "negeriRumah",
    ];

    editableFields.forEach((field) => {
      let initialValue = initialUserData[field];
      if (field === "tarikhLahir") initialValue = initialUserData["dob"];
      else if (field === "umur") initialValue = initialUserData["age"];

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

  const handleChange = (field: keyof Step2FormData, value: string | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleUploadProfileImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedImageFile(file);
    setPreviewImageUrl(URL.createObjectURL(file));
    setHasChanges(true);
  };

  const handleDeleteProfileImage = () => {
    setSelectedImageFile(null);
    setPreviewImageUrl(null);
    handleChange("profileImage", null);
    setHasChanges(true);
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
        .from("users")
        .update({
          fullname: formData.namaPenuh,
          title: formData.pangkat,
          phone_no: formData.telefon,
        })
        .eq("user_id", user.id);

      if (userUpdateError) throw userUpdateError;

      const { error: scoutUpdateError } = await supabase
        .from("scouts")
        .update({
          marital_status: formData.statusPerkahwinan,
          birth_place: formData.tempatLahir,
        })
        .eq("user_id", user.id);

      if (scoutUpdateError) throw scoutUpdateError;

      const { error: addressUpdateError } = await supabase
        .from("user_addresses")
        .update({
          address: formData.alamatRumah,
          postcode: formData.poskodRumah,
          district: formData.daerahRumah,
          state: formData.negeriRumah,
        })
        .eq("user_id", user.id);

      if (addressUpdateError) throw addressUpdateError;

      alert("Maklumat peribadi berjaya dikemaskini!");
    } catch (error: any) {
      console.error("Error saving data:", error.message);
      alert("Gagal mengemaskini maklumat: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 mt-5 px-8 py-4 border border-gray-400 rounded-md">
      <h3 className="mb-6 font-sans font-semibold">
        <span className="mr-1">2. </span>Maklumat Peribadi Pemohon dan Kumpulan
      </h3>

      <div className="space-y-2">
        <Label>Gambar Profile</Label>
        <div className="flex items-center gap-4">
          <div className="h-24 w-24 rounded-md border border-input bg-muted flex items-center justify-center overflow-hidden">
            <img
              src={
                previewImageUrl ??
                formData.profileImage ??
                "/placeholder.svg?height=96&width=96"
              }
              alt="Profile"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex flex-col gap-2">
            <input
              type="file"
              id="profileUpload"
              accept="image/*"
              className="hidden"
              onChange={handleUploadProfileImage}
            />
            <div className="flex gap-2">
              <Button
                type="button"
                size="sm"
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() =>
                  document.getElementById("profileUpload")?.click()
                }
                disabled={isUploading}
              >
                {isUploading ? "Uploading..." : "Muat Naik"}
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={handleDeleteProfileImage}
              >
                Padam
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="space-y-4">
        {/* NAMA PENUH */}
        <div className="flex w-full gap-5">
          <TextInputField
            id="namaPenuh"
            label="Nama Penuh"
            value={formData.namaPenuh}
            onChange={(e) => handleChange("namaPenuh", e.target.value)}
            required
          />
        </div>

        <div className="flex w-full gap-5">
          {/* PANGKAT */}
          <DropdownField
            id="pangkat"
            label="Pangkat"
            placeholder="Pilih Unit Tauliah"
            options={pangkatList}
            value={formData.pangkat}
            onValueChange={(value) => handleChange("pangkat", value)}
            required
          />

          {/* STATUS PERKAHWINAN */}
          <DropdownField
            id="statusPerkahwinan"
            label="Status Perkahwinan"
            placeholder="Pilih Status Perkahwinan"
            options={statusPerkahwinanList}
            value={formData.statusPerkahwinan} // This is correctly binding the value
            onValueChange={(value) => handleChange("statusPerkahwinan", value)}
            required
          />
        </div>

        <div className="flex w-full gap-5">
          {/* NO IC */}
          <TextInputField
            id="icNo"
            label="No. Kad Pengenalan"
            value={formData.ic}
            readOnly
            className="bg-muted"
            required
          />

          {/* EMAIL */}
          <TextInputField
            id="email"
            label="Email"
            value={formData.email}
            readOnly
            className="bg-muted"
            required
          />

          {/* NO TEL */}
          <PhoneNumberField
            id="no-telefon"
            label="No. Telefon"
            placeholder={formData.telefon}
            required
            value={formData.telefon}
            onChange={(e) => handleChange("telefon", e.target.value)}
          />
        </div>

        <div className="flex w-full gap-5">
          {/* JANTINA */}
          <TextInputField
            id="jantina"
            label="Jantina"
            value={formData.jantina}
            readOnly
            className="bg-muted"
            required
          />

          {/* KAUM */}
          <TextInputField
            id="kaum"
            label="Kaum"
            value={formData.kaum}
            readOnly
            className="bg-muted"
            required
          />

          {/* AGAMA */}
          <TextInputField
            id="agama"
            label="Agama"
            value={formData.agama}
            readOnly
            className="bg-muted"
            required
          />
        </div>

        <div className="flex w-full gap-5">
          {/* TARIKH LAHIR */}
          <TextInputField
            id="tarikhLahir"
            label="Tarikh Lahir"
            value={formData.tarikhLahir}
            readOnly
            className="bg-muted"
            required
          />

          {/* UMUR */}
          <TextInputField
            id="umur"
            label="Umur"
            value={formData.umur}
            readOnly
            className="bg-muted"
            required
          />

          {/* TEMPAT LAHIR */}
          <TextInputField
            id="tempatLahir"
            label="Tempat Lahir"
            value={formData.tempatLahir}
            onChange={(e) => handleChange("tempatLahir", e.target.value)}
            required
          />
        </div>

        <div className="flex w-full gap-5">
          {/* ALAMAT KEDIAMAN */}
          <TextInputField
            id="alamat"
            label="Alamat Kediaman"
            value={formData.alamatRumah}
            onChange={(e) => handleChange("alamatRumah", e.target.value)}
            required
          />
        </div>

        <div className="flex w-full gap-5">
          {/* POSKOD */}
          <TextInputField
            id="poskod"
            label="Poskod"
            value={formData.poskodRumah}
            onChange={(e) => handleChange("poskodRumah", e.target.value)}
            required
          />

          {/* DAERAH*/}
          <TextInputField
            id="daerah"
            label="Daerah"
            value={formData.daerahRumah}
            onChange={(e) => handleChange("daerahRumah", e.target.value)}
            required
          />

          {/* NEGERI */}
          <TextInputField
            id="negeri"
            label="Negeri"
            value={formData.negeriRumah}
            onChange={(e) => handleChange("negeriRumah", e.target.value)}
            required
          />
        </div>
      </div>
      <div className="flex justify-end mt-4">
        <Button onClick={handleSave} disabled={!hasChanges || isSaving}>
          {isSaving ? "Saving..." : "Save"}
        </Button>
      </div>

    </div>
  );
};

export default Step2;
