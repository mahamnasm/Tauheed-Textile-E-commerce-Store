import { NextResponse } from "next/server";

export function jsonError(message: string, status: number) {
  return NextResponse.json({ success: false, error: message }, { status });
}

export function unauthorized(message = "Unauthorized") {
  return jsonError(message, 401);
}

export function forbidden(message = "Forbidden") {
  return jsonError(message, 403);
}

export function internalError(first: unknown, second?: unknown) {
  if (typeof first === "string" && second !== undefined) {
    console.error(first, second);
    return jsonError("Something went wrong. Please try again later.", 500);
  }
  if (typeof second === "string") {
    console.error(second, first);
    return jsonError(second, 500);
  }
  console.error("Internal Server Error:", first);
  return jsonError("Something went wrong. Please try again later.", 500);
}

export function firstZodMessage(error: any) {
  const issues = error?.issues || error?.errors || [];
  return issues[0]?.message || "Invalid input data";
}

export function zodFieldErrors(error: any) {
  const issues = error?.issues || error?.errors || [];
  return issues.map((e: any) => ({
    field: (e?.path || []).map(String).join("."),
    message: e?.message || "Invalid value",
  }));
}
