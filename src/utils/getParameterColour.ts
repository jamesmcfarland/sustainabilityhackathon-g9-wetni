export function getParameterColour(parameter: string, value: number): string {
    if (value === null) return '#808080';  // gray for null values

    let severity = 0;  // 0 = safe, 1 = max severity

    switch (parameter) {
        case 'DO_MGL':
            if (value >= 8) return '#00ff00';
            severity = Math.min(1, Math.exp(1.5 * (5 - value)) - 1) / 20;
            break;
        case 'PH':
            const pHDiff = Math.min(Math.abs(value - 7.5) - 1, 0);
            severity = Math.min(1, Math.exp(2 * pHDiff) - 1) / 20;
            break;
        case 'BOD_MGL':
            if (value <= 1) return '#00ff00';
            severity = Math.min(1, Math.exp(1.2 * (value - 1)) - 1) / 15;
            break;
        case 'SS_MGL':
            if (value <= 10) return '#00ff00';
            severity = Math.min(1, Math.exp(0.1 * (value - 10)) - 1) / 15;
            break;
        case 'NH4_N_MGL':
            if (value <= 0.1) return '#00ff00';
            severity = Math.min(1, Math.exp(5 * (value - 0.1)) - 1) / 15;
            break;
        case 'NO3_N_MGL':
            if (value <= 5) return '#00ff00';
            severity = Math.min(1, Math.log2(1 + value - 5) / 5);
            break;
        case 'NO2_N_MGL':
            if (value <= 0.5) return '#00ff00';
            severity = Math.min(1, Math.log2(1 + 2 * (value - 0.5)) / 5);
            break;
        case 'CUSOL1_MGL':
            if (value <= 0.5) return '#00ff00';
            severity = Math.min(1, Math.log2(1 + 2 * (value - 0.5)) / 5);
            break;
        case 'CUSOL2_UGL':
            if (value <= 500) return '#00ff00';
            severity = Math.min(1, Math.log2(1 + 0.01 * (value - 500)) / 5);
            break;
        case 'FESOL1_UGL':
            if (value <= 150) return '#00ff00';
            severity = Math.min(1, Math.log2(1 + 0.02 * (value - 150)) / 5);
            break;
        case 'ZN_SOL_UGL':
            if (value <= 2500) return '#00ff00';
            severity = Math.min(1, Math.log2(1 + 0.001 * (value - 2500)) / 5);
            break;
        case 'COND_USCM':
            if (value <= 1000) return '#00ff00';
            severity = Math.min(1, Math.log2(1 + 0.003 * (value - 1000)) / 5);
            break;
        default:
            return '#808080';
    }

    // Convert severity to RGB
    const red = Math.round(255 * severity);
    const green = Math.round(255 * (1 - severity));
    return `#${red.toString(16).padStart(2, '0')}${green.toString(16).padStart(2, '0')}00`;
}