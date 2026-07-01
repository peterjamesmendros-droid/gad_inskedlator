import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { writeFile } from 'fs/promises';
import { join } from 'path';

// Fetch all system updates matched with cascading sub-comments
export async function GET() {
  try {
    const postsRes = await query('SELECT * FROM uploads ORDER BY id DESC');
    const posts = postsRes.rows;

    for (let post of posts) {
      const commentsRes = await query(
        'SELECT * FROM comments WHERE upload_id = $1 ORDER BY id DESC',
        [post.id]
      );
      post.comments = commentsRes.rows;
    }

    return NextResponse.json({ success: true, posts });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// Process data multi-part payloads (Post Updates)
export async function POST(request) {
  try {
    const formData = await request.formData();
    const title = formData.get('title');
    const description = formData.get('description');
    const category = formData.get('category');
    const progress = parseInt(formData.get('progress') || '0', 10);
    const file = formData.get('file');

    if (!file) throw new Error("File input signature missing.");

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save locally inside public/uploads folder configuration
    const path = join(process.cwd(), 'public', 'uploads', file.name);
    await writeFile(path, buffer);

    const insertRes = await query(
      `INSERT INTO uploads (title, description, category, filename, file_path, progress) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [title, description, category, file.name, file.name, progress]
    );

    return NextResponse.json({ success: true, post: insertRes.rows[0] });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// Process individual asset deletions
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('id');
    const commentId = searchParams.get('comment_id');

    if (commentId) {
      await query('DELETE FROM comments WHERE id = $1', [commentId]);
      return NextResponse.json({ success: true, message: "Comment destroyed." });
    }

    if (postId) {
      await query('DELETE FROM uploads WHERE id = $1', [postId]);
      return NextResponse.json({ success: true, message: "Post and assets destroyed." });
    }

    return NextResponse.json({ success: false, message: "Bad request payload parameters." }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}