export function calculateResult(left: number, op: string | null, right: number | null): number {
  if (!op || right === null || right === undefined) return left;
  switch (op) {
    case "+": return left + right;
    case "-": return left - right;
    case "*": return left * right;
    case "/":
      if (right === 0) throw new Error("DivisionByZero");
      return left / right;
    default: throw new Error("UnsupportedOperation");
  }
}
