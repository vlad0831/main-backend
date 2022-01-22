const INVESTMENT_VALUES = ['BIBL', 'ICLN', 'NACP', 'PHO', 'SHE'] as const;
const GROUPS = [
  'blockchain',
  'commodity',
  'equity',
  'factor',
  'fixed income',
  'gold',
  'innovation',
  'real estate',
] as const;
const PRIMES = [2, 3, 5, 7, 11, 13, 17, 19];

export type InvestmentValue = typeof INVESTMENT_VALUES[number];
export type Group = typeof GROUPS[number];

function generateUniqueId<T extends string>(
  values: T[],
  source: readonly T[]
): BigInt {
  // Sanity check.
  if (values.length > PRIMES.length || values.length > source.length) {
    throw new Error('Invalid values.');
  }

  const multiplierMap: Record<string, bigint> = source.reduce(
    (accObj, item, idx) => {
      accObj[item.toLowerCase()] = BigInt(PRIMES[idx]);
      return accObj;
    },
    {}
  );

  return values.reduce((result, value) => {
    const multiplier = multiplierMap[value.toLowerCase()];
    if (multiplier === undefined) {
      throw new Error('Invalid values.');
    }

    return result * multiplier;
  }, BigInt(1));
}

export function hashPreferences(
  investmentValues: InvestmentValue[],
  groups: Group[],
  riskTolerance: number
) {
  return `${generateUniqueId(
    investmentValues,
    INVESTMENT_VALUES
  )}-${generateUniqueId(groups, GROUPS)}-${riskTolerance}`;
}
