import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

// 1. GET: Fetch all posts and attach their related comments
export async function GET() {
  try {
    const postsRes = await query('SELECT * FROM uploads ORDER BY id DESC');
    const posts = postsRes?.rows || [];

    for (let post of posts) {
      const commentsRes = await query(
        'SELECT * FROM comments WHERE upload_id = $1 ORDER BY id DESC',
        [post.id]
      );
      post.comments = commentsRes?.rows || [];
    }

    return NextResponse.json({ success: true, posts });
  } catch (error) {
    console.error("Posts GET Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// 2. POST: Create a new post from a Multipart FormData submission
export async function POST(request) {
  try {
    // FIX: Use request.formData() instead of request.json() to handle files and text input fields correctly
    const formData = await request.formData();
    const title = formData.get('title');
    const description = formData.get('description');
    const category = formData.get('category');
    const progress = parseInt(formData.get('progress') || '0', 10);
    const file = formData.get('file');

    let fileName = '';
    let filePath = '';

    if (file && file.name && file.size > 0) {
      fileName = file.name;
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadDir = join(process.cwd(), 'public', 'uploads');
      await mkdir(uploadDir, { recursive: true });

      const path = join(uploadDir, fileName);
      await writeFile(path, buffer);
      filePath = fileName; // store filename only; pages prepend /uploads/ when serving
    }

    const insertQuery = `
      INSERT INTO uploads (title, description, category, filename, file_path, progress) 
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING *
    `;
    
    const result = await query(insertQuery, [title, description, category, fileName, filePath, progress]);
    const newPost = result?.rows?.[0];

    return NextResponse.json({ 
      success: true, 
      post: { ...newPost, comments: [] } 
    });
  } catch (error) {
    // FIX: Relabeled this accurately so it reflects "Posts" inside the server terminal logs
    console.error("ACTUAL Posts POST Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// 3. DELETE: Handle deletion requests
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('id');

    if (postId) {
      await query('DELETE FROM uploads WHERE id = $1', [postId]);
      return NextResponse.json({ success: true, message: "Post deleted successfully." });
    }

    return NextResponse.json({ success: false, message: "Missing post ID parameter." }, { status: 400 });
  } catch (error) {
    console.error("Posts DELETE Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}