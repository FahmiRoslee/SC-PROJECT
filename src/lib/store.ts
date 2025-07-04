import { configureStore } from '@reduxjs/toolkit';
import teamReducer from './redux/teams/teamSlice';
import counterReducer from "./counter/counterSlice";
import penilaianTauliahReducer from "./redux/penilaianTauliah/penilaianTauliahSlice"
import pengakapReducer from "./redux/pengakap/pengakapSlice";
import permohonanTauliahReducer from "./redux/permohonanTauliah/permohonanTauliahSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      counter: counterReducer,
      teams: teamReducer,
      penilaianTauliah: penilaianTauliahReducer,
      permohonanTauliah: permohonanTauliahReducer,
      pengakap: pengakapReducer,
    },
    
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false, // 🚨 disables serializable value warning
      }),    
    })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
