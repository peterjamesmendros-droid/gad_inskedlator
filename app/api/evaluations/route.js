import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// POST submit evaluation
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      name, role,
      child_cleanliness, child_safety, child_toys, child_comfort, child_supervision,
      lact_privacy, lact_clean, lact_comfort, lact_access, lact_equipment,
      gender_respect, gender_equality, gender_worklife, gender_discrimination,
      impact_stress, impact_needs, suggestions
    } = body;

    if (!role) return NextResponse.json({ success: false, message: 'Role is required.' }, { status: 400 });

    await query(
      `INSERT INTO evaluations
        (name,role,child_cleanliness,child_safety,child_toys,child_comfort,child_supervision,
         lact_privacy,lact_clean,lact_comfort,lact_access,lact_equipment,
         gender_respect,gender_equality,gender_worklife,gender_discrimination,
         impact_stress,impact_needs,suggestions)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19)`,
      [name||null, role,
       child_cleanliness, child_safety, child_toys, child_comfort, child_supervision,
       lact_privacy, lact_clean, lact_comfort, lact_access, lact_equipment,
       gender_respect, gender_equality, gender_worklife, gender_discrimination,
       impact_stress, impact_needs, suggestions||null]
    );
    return NextResponse.json({ success: true, message: 'Thank you! Your evaluation has been submitted.' });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// GET summary (admin only)
export async function GET() {
  try {
    const avgRes = await query(`
      SELECT
        AVG(child_cleanliness)::numeric(4,2) AS child_cleanliness,
        AVG(child_safety)::numeric(4,2) AS child_safety,
        AVG(child_toys)::numeric(4,2) AS child_toys,
        AVG(child_comfort)::numeric(4,2) AS child_comfort,
        AVG(child_supervision)::numeric(4,2) AS child_supervision,
        AVG(lact_privacy)::numeric(4,2) AS lact_privacy,
        AVG(lact_clean)::numeric(4,2) AS lact_clean,
        AVG(lact_comfort)::numeric(4,2) AS lact_comfort,
        AVG(lact_access)::numeric(4,2) AS lact_access,
        AVG(lact_equipment)::numeric(4,2) AS lact_equipment,
        AVG(gender_respect)::numeric(4,2) AS gender_respect,
        AVG(gender_equality)::numeric(4,2) AS gender_equality,
        AVG(gender_worklife)::numeric(4,2) AS gender_worklife,
        AVG(gender_discrimination)::numeric(4,2) AS gender_discrimination,
        AVG(impact_stress)::numeric(4,2) AS impact_stress,
        AVG(impact_needs)::numeric(4,2) AS impact_needs,
        COUNT(*)::int AS total_responses
      FROM evaluations
    `);

    const roleRes = await query(`SELECT role, COUNT(*)::int c FROM evaluations GROUP BY role ORDER BY c DESC`);

    const indivRes = await query(`
      SELECT evaluation_id, name, role, suggestions,
        to_char(date_submitted,'Mon DD, YYYY HH12:MI AM') AS date_fmt,
        ROUND((child_cleanliness+child_safety+child_toys+child_comfort+child_supervision+
               lact_privacy+lact_clean+lact_comfort+lact_access+lact_equipment+
               gender_respect+gender_equality+gender_worklife+gender_discrimination+
               impact_stress+impact_needs)::numeric/16,1) AS overall_score
      FROM evaluations ORDER BY date_submitted DESC
    `);

    return NextResponse.json({
      success: true,
      averages: avgRes.rows[0],
      roleCounts: roleRes.rows,
      responses: indivRes.rows
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
