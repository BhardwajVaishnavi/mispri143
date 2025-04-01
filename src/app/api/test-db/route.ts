import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // Try to connect to the database
    await prisma.$connect();
    
    // Get the database connection information
    const databaseUrl = process.env.DATABASE_URL || 'Not set';
    const directUrl = process.env.DIRECT_URL || 'Not set';
    
    // Return success message
    return NextResponse.json({
      status: 'success',
      message: 'Database connection successful',
      databaseInfo: {
        databaseUrl: databaseUrl.replace(/:[^:]*@/, ':****@'), // Hide password
        directUrl: directUrl.replace(/:[^:]*@/, ':****@'), // Hide password
      }
    });
  } catch (error) {
    console.error('Database connection error:', error);
    
    // Return error message
    return NextResponse.json({
      status: 'error',
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : String(error),
      databaseUrl: process.env.DATABASE_URL ? 'Set (hidden)' : 'Not set',
      directUrl: process.env.DIRECT_URL ? 'Set (hidden)' : 'Not set',
    }, { status: 500 });
  } finally {
    // Disconnect from the database
    await prisma.$disconnect();
  }
}
