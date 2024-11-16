import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const currencies = searchParams.get('currencies') || '';

  const res = await fetch(
    `http://localhost:8080/api/v1/2024/exchange-rate/latest?base=USD&targets=${currencies}`,
    {
      cache: 'no-store', // To ensure fresh data on every request
    }
  );

  if (!res.ok) {
    return NextResponse.error();
  }

  const data = await res.json();
  return NextResponse.json(data);
}
