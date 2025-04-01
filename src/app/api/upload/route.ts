import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import * as ftp from 'basic-ftp';
import { Readable } from 'stream';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

// FTP configuration for cPanel
const FTP_HOST = process.env.FTP_HOST || '';
const FTP_USER = process.env.FTP_USER || '';
const FTP_PASSWORD = process.env.FTP_PASSWORD || '';
const FTP_BASE_PATH = process.env.FTP_BASE_PATH || '/public_html/images';
const PUBLIC_URL_BASE = process.env.PUBLIC_URL_BASE || 'https://yourdomain.com/images';

/**
 * Handles image upload to cPanel via FTP
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only allow admin users to upload
    if (session.user.role !== 'ADMIN' && session.user.role !== 'SUPERADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Parse the multipart form data
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'products';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large (max 5MB)' }, { status: 400 });
    }

    // Generate a unique filename
    const fileExtension = path.extname(file.name);
    const uniqueFilename = `${uuidv4()}${fileExtension}`;
    const remotePath = `${FTP_BASE_PATH}/${folder}`;
    const remoteFilePath = `${remotePath}/${uniqueFilename}`;
    
    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Upload to cPanel via FTP
    const client = new ftp.Client();
    client.ftp.verbose = process.env.NODE_ENV === 'development';
    
    try {
      await client.access({
        host: FTP_HOST,
        user: FTP_USER,
        password: FTP_PASSWORD,
        secure: true
      });
      
      // Ensure the directory exists
      try {
        await client.ensureDir(remotePath);
      } catch (error) {
        // If directory doesn't exist, create it
        await client.mkdir(remotePath, true);
      }
      
      // Upload the file
      const readable = new Readable();
      readable._read = () => {}; // Required but not used
      readable.push(buffer);
      readable.push(null); // End of stream
      
      await client.uploadFrom(readable, remoteFilePath);
      
      // Generate the public URL
      const publicUrl = `${PUBLIC_URL_BASE}/${folder}/${uniqueFilename}`;
      
      return NextResponse.json({ 
        success: true, 
        url: publicUrl 
      });
    } finally {
      client.close();
    }
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    }, { status: 500 });
  }
}

/**
 * Handles image deletion from cPanel via FTP
 */
export async function DELETE(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only allow admin users to delete
    if (session.user.role !== 'ADMIN' && session.user.role !== 'SUPERADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Parse the request body
    const body = await request.json();
    const { filename } = body;

    if (!filename) {
      return NextResponse.json({ error: 'No filename provided' }, { status: 400 });
    }

    // Extract folder from filename (assuming URL format like /images/products/filename.jpg)
    const urlParts = filename.split('/');
    const actualFilename = urlParts[urlParts.length - 1];
    const folder = urlParts[urlParts.length - 2] || 'products';
    
    // Delete from cPanel via FTP
    const client = new ftp.Client();
    client.ftp.verbose = process.env.NODE_ENV === 'development';
    
    try {
      await client.access({
        host: FTP_HOST,
        user: FTP_USER,
        password: FTP_PASSWORD,
        secure: true
      });
      
      const remotePath = `${FTP_BASE_PATH}/${folder}/${actualFilename}`;
      await client.remove(remotePath);
      
      return NextResponse.json({ success: true });
    } finally {
      client.close();
    }
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    }, { status: 500 });
  }
}
