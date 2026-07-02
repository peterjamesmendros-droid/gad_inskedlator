import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Explicitly parse values to safe types before database binding
    const uploadId = parseInt(body.upload_id, 10);
    const authorName = String(body.name || 'Admin').trim();
    const commentText = String(body.comment || '').trim();

    if (!uploadId || !commentText) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    // Explicit parameterized value array passed to postgres pool
    const insertQuery = 'INSERT INTO comments (upload_id, name, comment) VALUES ($1, $2, $3) RETURNING *';
    const result = await query(insertQuery, [uploadId, authorName, commentText]);
    
    return NextResponse.json({ 
      success: true, 
      comment: result?.rows?.[0] || null 
    });
    
  } catch (error) {
    console.error("Comments POST Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ success: false, error: "Missing comment ID" }, { status: 400 });
    }

    await query('DELETE FROM comments WHERE id = $1', [parseInt(id, 10)]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Comments DELETE Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}