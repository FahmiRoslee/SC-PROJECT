import React from "react";
import { DropdownField, TextInputField } from "../ui/customInputFeild";
import { johorDaerahList } from "@components/lib/utils";
import { useDispatch } from "react-redux";
import { setCredentialName } from "@components/lib/redux/permohonanTauliah/permohonanTauliahSlice";

interface Step1Props {
  userData: any;
}

const TauliahProgressLegend: React.FC = () => {
  return (
    <div className="mt-10 flex justify-center gap-6 text-xs text-gray-600">
      <div className="flex items-center gap-2">
        <span className="w-3 h-3 rounded-full bg-green-500 inline-block" />
        <span>Selesai</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="w-3 h-3 rounded-full bg-yellow-500 inline-block" />
        <span>Semasa</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="w-3 h-3 rounded-full bg-blue-500 inline-block" />
        <span>Seterusnya</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="w-3 h-3 rounded-full bg-gray-300 inline-block" />
        <span>Belum Capai</span>
      </div>
    </div>
  );
};

const Step1: React.FC<Step1Props> = ({ userData }) => {

  if (!userData) {
    return (
      <div className="p-4 text-sm text-gray-500 italic">
        Sedang memuat data pengguna...
      </div>
    );
  }

  const dispatch = useDispatch();
  dispatch(setCredentialName(userData.unitTauliahKini))

  const namaTauliahList = [
    { label: "Penolong Pemimpin", value: "Penolong Pemimpin" },
    { label: "Pemimpin", value: "Pemimpin" },
    { label: "Penolong Pesuruhjaya Daerah", value: "Penolong Pesuruhjaya Daerah" },
    { label: "Pesuruhjaya Daerah", value: "Pesuruhjaya Daerah" },
    { label: "Penolong Pesuruhjaya Negeri", value: "Penolong Pesuruhjaya Negeri" },
    { label: "Pesuruhjaya Negeri", value: "Pesuruhjaya Negeri" },
  ];

  const currentIndex = namaTauliahList.findIndex(
    (item) => item.value === userData.unitTauliahKini
  );
  
  const nextTauliahIndex = currentIndex + 1;
  const nextTauliah =
    nextTauliahIndex < namaTauliahList.length
      ? namaTauliahList[nextTauliahIndex].value
      : "";

  dispatch(setCredentialName(nextTauliah))

  return (
    <div className="space-y-6 mt-5 px-8 py-4 border border-gray-400 rounded-md">
      {/* Progress Tauliah Section */}
      <div className="bg-gray-50 border border-gray-200 rounded-md p-4 mb-6">
        <h4 className="text-sm font-semibold mb-3">Progress Tauliah</h4>

        <div className="flex justify-between items-start relative">
          <div className="absolute top-2 left-0 right-0 h-0.5 bg-gray-300 z-0" />

          {namaTauliahList.map((item, index) => {
            const isCurrent = item.value === userData.unitTauliahKini;
            const isCompleted = index < currentIndex;
            const isNext = index === nextTauliahIndex;

            const circleColor = isCurrent
              ? "bg-yellow-500"
              : isCompleted
              ? "bg-green-500"
              : isNext
              ? "bg-blue-500"
              : "bg-gray-300";

            const textColor = isCurrent
              ? "text-yellow-700 font-semibold"
              : isCompleted
              ? "text-green-600"
              : isNext
              ? "text-blue-600 font-medium"
              : "text-gray-500";

            return (
              <div
                key={item.value}
                className="relative flex flex-col items-center flex-1 z-10"
              >
                <div className={`w-4 h-4 rounded-full ${circleColor} mb-1`} />
                <span className={`text-xs text-center max-w-[70px] ${textColor}`}>
                  {item.label}
                </span>
                {isCurrent && (
                  <span className="text-[10px] text-yellow-600 mt-1">
                    Anda berada di sini
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* ✅ Legend below progress bar */}
        <TauliahProgressLegend />
      </div>

      <h3 className="mb-6 font-sans font-semibold">
        <span className="mr-1">1.</span>Maklumat Tauliah
      </h3>

      <div className="flex w-full gap-5">
        <TextInputField
          id="unitTauliahKini"
          label="Unit Tauliah Kini"
          value={userData.unitTauliahKini}
          readOnly
          className="bg-muted"
          required
        />
      </div>

      <div className="flex w-full gap-5">
        <TextInputField
          id="unit-tauliah"
          label="Nama Tauliah"
          placeholder="Pilih Nama Tauliah Untuk Dipohon"
          value={nextTauliah}
          readOnly
        />
        <DropdownField
          id="nama-tauliah"
          label="Daerah Tauliah"
          placeholder="Pilih Nama Tauliah"
          options={johorDaerahList}
        />
        <TextInputField
          id="negeriTauliah"
          label="Negeri Tauliah"
          value="Johor"
          readOnly
          className="bg-muted"
          required
        />
      </div>
    </div>
  );
};

export default Step1;
