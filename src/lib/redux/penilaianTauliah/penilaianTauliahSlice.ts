import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface OfficerInfo {
  level: string;
  id: string | null;
}

interface PenilaianTauliahState {
  currOfficerRole: string
  
  applicantId: any | null,
  credentialApplicationId: any | null,
  teamId: any | null,
  leaderId: any | null,
  teamDistrict: string,
  
  credentialApplicationName: string,
  status: string,
  credential_level: string,
  
  validatedBorangId: string[],
  hasAllBorangId: boolean;
  
  SignFile: File | null;
  hasUploadedSignPDF: boolean;
  
  correctFields: string[];
  incorrectFields: string[];
  missingFields: string[];

  officerList: OfficerInfo[];
}

const initialState: PenilaianTauliahState = {
  currOfficerRole: "Pemimpin Kumpulan",
  
  applicantId: null,
  credentialApplicationId: null,
  teamId: null,
  leaderId: null,
  teamDistrict: "",
  
  credentialApplicationName: "",
  status: "",
  credential_level: "",
  
  validatedBorangId: [],
  hasAllBorangId: false,
  
  SignFile: null,
  hasUploadedSignPDF: false,
  
  correctFields: [],
  incorrectFields: [],
  missingFields: [],

  officerList: [
    { level: "pemimpin kumpulan", id: null },
    { level: "daerah", id: null },
    { level: "negeri", id: null },
  ],  
};

const penilaianTauliahSlice = createSlice({
  name: "penilaianTauliah",
  initialState,
  reducers: {

    setCurrOfficerRole: (state, action: PayloadAction<string>) => {
      state.currOfficerRole = action.payload;
    },

    setApplicantId: (state, action: PayloadAction<string>) => {
      state.applicantId = action.payload;
    },

    setCredentialApplicationId: (state, action: PayloadAction<string>) => {
      state.credentialApplicationId = action.payload;
    },

    setTeamId: (state, action: PayloadAction<string>) => {
      state.teamId = action.payload;
    },
    setLeaderId: (state, action: PayloadAction<string>) => {
      state.leaderId = action.payload;
    },
    setTeamDistrict: (state, action: PayloadAction<string>) => {
      state.teamDistrict = action.payload;
    },

    setCredentialApplicationName: (state, action: PayloadAction<string>) => {
      state.credentialApplicationName = action.payload;
    },

    setCredentialStatus: (state, action: PayloadAction<string>) => {
      state.status = action.payload;
    },
    setCredentialLevel: (state, action: PayloadAction<string>) => {
      state.credential_level = action.payload;
    },

    // ValidatedBorangId reducers
    setValidatedBorangId: (state, action: PayloadAction<string[]>) => {
        // Combine existing fields with new payload, then deduplicate
        state.validatedBorangId = [...new Set([...state.validatedBorangId, ...action.payload])];
    }, 
    addValidatedBorangId: (state, action: PayloadAction<string>) => {
      // Add field only if it's not already present (for uniqueness)
      if (!state.validatedBorangId.includes(action.payload)) {
        state.validatedBorangId.push(action.payload);
      }
    }, 
    removeValidatedBorangId: (state, action: PayloadAction<string>) => {
      state.validatedBorangId = state.validatedBorangId.filter(field => field !== action.payload);
    },

    setHasAllBorangId: (state, action: PayloadAction<boolean>) => {
      state.hasAllBorangId = action.payload;
    },


    setSignFile: (state, action: PayloadAction<File | null>) => {
      state.SignFile = action.payload;
    },
    setUploadedSignPDF: (state, action: PayloadAction<boolean>) => {
      state.hasUploadedSignPDF = action.payload;
    },

    // correct feilds reducers
    setCorrectFields: (state, action: PayloadAction<string[]>) => {
        state.correctFields = [...new Set([...state.correctFields, ...action.payload])];
    }, 
    addCorrectField: (state, action: PayloadAction<string>) => {
      if (!state.correctFields.includes(action.payload)) {
        state.correctFields.push(action.payload);
      }
    }, 
    removeCorrectField: (state, action: PayloadAction<string>) => {
      state.correctFields = state.correctFields.filter(field => field !== action.payload);
    },

    // incorrect feilds reducers
    setIncorrectFields: (state, action: PayloadAction<string[]>) => {
        state.incorrectFields = [...new Set([...state.incorrectFields, ...action.payload])];
    }, 
    addIncorrectField: (state, action: PayloadAction<string>) => {
      if (!state.incorrectFields.includes(action.payload)) {
        state.incorrectFields.push(action.payload);
      }
    }, 
    removeIncorrectField: (state, action: PayloadAction<string>) => {
      state.incorrectFields = state.incorrectFields.filter(field => field !== action.payload);
    },

    // missing feilds reducers
    setMissingFields: (state, action: PayloadAction<string[]>) => {
        state.missingFields = [...new Set([...state.missingFields, ...action.payload])];
    }, 
    addMissingField: (state, action: PayloadAction<string>) => {
      if (!state.missingFields.includes(action.payload)) {
        state.missingFields.push(action.payload);
      }
    }, 
    removeMissingField: (state, action: PayloadAction<string>) => {
      state.missingFields = state.missingFields.filter(field => field !== action.payload);
    },

    // officer list reducers
    setOfficerList: (state, action: PayloadAction<OfficerInfo[]>) => {
      state.officerList = action.payload;
    },    
    
    
    clearPenilaianTauliahState: (state) => {
      return initialState;
    },
  },
});

export const {
  setCurrOfficerRole, 

  setApplicantId,
  setCredentialApplicationId,
  
  setTeamId,
  setLeaderId,
  setTeamDistrict,

  setCredentialApplicationName,
  setCredentialLevel,
  setCredentialStatus,

  setValidatedBorangId,
  addValidatedBorangId,
  removeValidatedBorangId,
  setHasAllBorangId,

  setSignFile,
  setUploadedSignPDF,
  clearPenilaianTauliahState,
  
  setCorrectFields,
  addCorrectField,
  removeCorrectField,
  
  setIncorrectFields,
  addIncorrectField,
  removeIncorrectField,
  
  setMissingFields,
  addMissingField,
  removeMissingField,

  setOfficerList,

} = penilaianTauliahSlice.actions;

export default penilaianTauliahSlice.reducer;