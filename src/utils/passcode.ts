export function generatePasscode(length: 4 | 6 = 6): string {
  const min = length === 4 ? 1000 : 100000;
  const max = length === 4 ? 9999 : 999999;
  return Math.floor(Math.random() * (max - min + 1) + min).toString();
}

export function formatPasscode(passcode: string): string {
  if (passcode.length === 6) {
    return `${passcode.slice(0, 3)}-${passcode.slice(3)}`;
  }
  return passcode;
}
