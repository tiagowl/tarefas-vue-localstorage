export const isValidTitle = (value: string): boolean => value.trim().length > 0;

export const normalizeTitle = (value: string): string => value.trim();

export const normalizeDescription = (value: string): string | undefined => {
  const trimmed = value.trim();
  return trimmed === '' ? undefined : trimmed;
};
