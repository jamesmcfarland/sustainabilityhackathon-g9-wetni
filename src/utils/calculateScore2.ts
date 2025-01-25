type WaterQualityData = {
    OBJECTID: number;
    Site_Code: string;
    Site_Status_21Oct2020: string;
    Station_Name: string;
    RWB_ID_RBP2: string;
    Primary_Basin: string;
    X: number;
    Y: number;
    Date: string;
    Time: string;
    Depth: number;
    ALK_MGL: number | null;
    BOD_MGL: number | null;
    COND_USCM: number | null;
    CUSOL1_MGL: number | null;
    CUSOL2_UGL: string | null;
    DO_MGL: number | null;
    FESOL1_UGL: string | null;
    NO3_N_MGL: number | null;
    NO2_N_MGL: number | null;
    NH4_N_MGL: number | null;
    PH: number | null;
    P_SOL_MGL: number | null;
    SS_MGL: number | null;
    ZN_SOL_UGL: string | null;
    GlobalID: string;
  };

  export function calculateScore(data: WaterQualityData): number {
    let score = 0;
    const weightFactors = {
      ALK_MGL: 1,
      BOD_MGL: -1, // Lower is better
      COND_USCM: -0.5, // Lower is better
      CUSOL2_UGL: -0.1,
      DO_MGL: 2, // Higher is better
      FESOL1_UGL: -0.05,
      NO3_N_MGL: -0.2,
      NO2_N_MGL: -1,
      NH4_N_MGL: -1.5,
      PH: 1, // Optimal at neutral levels
      P_SOL_MGL: -2,
      ZN_SOL_UGL: -0.1,
    };

    // Helper function to safely parse strings to numbers and handle null
    const parseValue = (value: string | number | null): number | null => {
      if (value === null) return null;
      if (typeof value === "string") {
        const parsed = parseFloat(value);
        return isNaN(parsed) ? null : parsed;
      }
      return value;
    };

    // Apply weights for each parameter
    if (data.ALK_MGL !== null) score += data.ALK_MGL * weightFactors.ALK_MGL;
    if (data.BOD_MGL !== null) score += data.BOD_MGL * weightFactors.BOD_MGL;
    if (data.COND_USCM !== null) score += data.COND_USCM * weightFactors.COND_USCM;
    const cusol2 = parseValue(data.CUSOL2_UGL);
    if (cusol2 !== null) score += cusol2 * weightFactors.CUSOL2_UGL;
    if (data.DO_MGL !== null) score += data.DO_MGL * weightFactors.DO_MGL;
    const fesol1 = parseValue(data.FESOL1_UGL);
    if (fesol1 !== null) score += fesol1 * weightFactors.FESOL1_UGL;
    if (data.NO3_N_MGL !== null) score += data.NO3_N_MGL * weightFactors.NO3_N_MGL;
    if (data.NO2_N_MGL !== null) score += data.NO2_N_MGL * weightFactors.NO2_N_MGL;
    if (data.NH4_N_MGL !== null) score += data.NH4_N_MGL * weightFactors.NH4_N_MGL;
    if (data.PH !== null) score += (data.PH - 7) * weightFactors.PH; // Penalize deviations from neutral pH
    if (data.P_SOL_MGL !== null) score += data.P_SOL_MGL * weightFactors.P_SOL_MGL;
    const znSol = parseValue(data.ZN_SOL_UGL);
    if (znSol !== null) score += znSol * weightFactors.ZN_SOL_UGL;

    return Math.round(score * 100) / 100; // Round to 2 decimal places
  }
