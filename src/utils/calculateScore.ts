export type WaterQualityData = {
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

export function calculateWaterQualityScore(input: WaterQualityData): number {
  if (
    input.DO_MGL === null ||
    input.PH === null ||
    input.BOD_MGL === null ||
    input.NH4_N_MGL === null
  ) {
    return -1;
  }

  let score = 100;

  // Primary parameters with scaled penalties
  // DO: Critical range < 5, safe > 8
  if (input.DO_MGL < 8) {
    const impact = Math.exp(1.5 * (5 - input.DO_MGL)) - 1;
    score -= Math.min(20, Math.max(0, impact));
  }

  // pH: 6.5-8.5 optimal
  const pHDiff = Math.min(Math.abs(input.PH - 7.5) - 1, 0);
  if (pHDiff !== 0) {
    score -= Math.min(20, Math.exp(2 * pHDiff) - 1);
  }

  // BOD: Critical > 3, safe < 1
  if (input.BOD_MGL > 1) {
    score -= Math.min(15, Math.exp(1.2 * (input.BOD_MGL - 1)) - 1);
  }

  // NH4_N: Critical > 0.5, safe < 0.1
  if (input.NH4_N_MGL > 0.1) {
    score -= Math.min(15, Math.exp(5 * (input.NH4_N_MGL - 0.1)) - 1);
  }

  // Secondary parameters with logarithmic scaling
  if (input.NO3_N_MGL !== null && input.NO3_N_MGL > 5) {
    score -= Math.min(5, Math.log2(1 + input.NO3_N_MGL - 5));
  }
  if (input.NO2_N_MGL !== null && input.NO2_N_MGL > 0.5) {
    score -= Math.min(5, Math.log2(1 + 2 * (input.NO2_N_MGL - 0.5)));
  }
  if (input.CUSOL1_MGL !== null) {
    if (input.CUSOL1_MGL > 0.5)
      score -= Math.min(5, Math.log2(1 + 2 * (input.CUSOL1_MGL - 0.5)));
  }
  if (input.CUSOL2_UGL !== null) {
    const val = parseFloat(input.CUSOL2_UGL);
    if (val > 500) score -= Math.min(5, Math.log2(1 + 0.01 * (val - 500)));
  }
  if (input.FESOL1_UGL !== null) {
    const val = parseFloat(input.FESOL1_UGL);
    if (val > 150) score -= Math.min(5, Math.log2(1 + 0.02 * (val - 150)));
  }
  if (input.ZN_SOL_UGL !== null) {
    const val = parseFloat(input.ZN_SOL_UGL);
    if (val > 2500) score -= Math.min(5, Math.log2(1 + 0.001 * (val - 2500)));
  }
  if (input.COND_USCM !== null && input.COND_USCM > 1000) {
    score -= Math.min(5, Math.log2(1 + 0.003 * (input.COND_USCM - 1000)));
  }

  return Math.max(0, Math.round(score * 10) / 10);
}
