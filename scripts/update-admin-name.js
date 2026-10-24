const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://postgres.pddjqenodzettkjdjoof:Jutt%4012453266@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres',
  ssl: { rejectUnauthorized: false }
});

async function run() {
  await pool.query('UPDATE public.users SET name = $1, email = $2 WHERE id = $3', ['Royal Executive', 'admin@royalshoes.store', 'admin-01']);
  await pool.query('UPDATE public.coupons SET code = $1 WHERE code = $2', ['ROYAL500', 'SAWERA500']);
  const res = await pool.query('SELECT id, name, email, role FROM public.users');
  console.log('UPDATED USERS:', res.rows);
  const cp = await pool.query('SELECT id, code FROM public.coupons');
  console.log('COUPONS:', cp.rows);
  await pool.end();
}

run();
