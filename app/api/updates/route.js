import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET all posts with comments
export async function GET() {
  try {
    const postsRes = await query('SELECT * FROM uploads ORDER BY id DESC');
    const posts = postsRes.rows;
    for (const post of posts) {
      const commentsRes = await query('SELECT * FROM comments WHERE upload_id=$1 ORDER BY id DESC', [post.id]);
      post.comments = commentsRes.rows;
    }
    return NextResponse.json({ success: true, posts });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// POST add comment
export async function POST(request) {
  try {
    const { upload_id, comment, user_name } = await request.json();
    if (!upload_id || !comment || !user_name)
      return NextResponse.json({ success: false, message: 'Missing fields' }, { status: 400 });
    await query('INSERT INTO comments (upload_id, name, comment) VALUES ($1,$2,$3)', [upload_id, user_name, comment]);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// DELETE own comment (server verifies ownership via name match)
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const commentId = searchParams.get('comment_id');
    const userName  = searchParams.get('user_name');
    if (!commentId || !userName)
      return NextResponse.json({ success: false, message: 'Missing params' }, { status: 400 });
    await query('DELETE FROM comments WHERE id=$1 AND name=$2', [commentId, userName]);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
