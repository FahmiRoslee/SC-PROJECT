import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { setCredentialApplicationId } from "../penilaianTauliah/penilaianTauliahSlice";

interface PermohonanTauliahState {
  credentialName: string
  sijilManikayuFile: File | null;
  salinanICFile: File | null;
  kadKeahlianPengakapFile: File | null;
  signatureFile: File | null;

}

const initialState: PermohonanTauliahState = {
  credentialName: "",
  sijilManikayuFile: null,
  salinanICFile: null,
  kadKeahlianPengakapFile: null,
  signatureFile: null,
}

const penilaianTauliahSlice = createSlice({
  name: "permohonanTauliah",
  initialState,
  reducers: {

    
    setCredentialName: (state, action: PayloadAction<string>) => {
      state.credentialName = action.payload;
    },

    setSijilManikayuFile: (state, action: PayloadAction<File | null>) => {
      state.sijilManikayuFile = action.payload;
    },
    setSalinanICFile: (state, action: PayloadAction<File | null>) => {
      state.salinanICFile = action.payload;
    },
    setKadKeahlianPengakapFile: (state, action: PayloadAction<File | null>) => {
      state.kadKeahlianPengakapFile = action.payload;
    },
    setSignatureFile: (state, action: PayloadAction<File | null>) => {
      state.signatureFile = action.payload;
    },

    clearPermohonanTauliahState: (state) => {
      return initialState;
    },
  },
});

export const {
  setCredentialName,
  
  setSijilManikayuFile,
  setSalinanICFile,
  setKadKeahlianPengakapFile,
  setSignatureFile,
  
} = penilaianTauliahSlice.actions;

export default penilaianTauliahSlice.reducer;