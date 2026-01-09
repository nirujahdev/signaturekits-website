// Script to create admin user with proper password hash
// Run: node scripts/create-admin-user.js

const bcrypt = require('bcrypt');

async function createAdminUser() {
  const email = 'benaiah';
  const password = 'benaiah1234';
  
  // Hash password
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);
  
  console.log('Admin User Credentials:');
  console.log('Email:', email);
  console.log('Password:', password);
  console.log('\nPassword Hash (use this in Supabase):');
  console.log(passwordHash);
  console.log('\nSQL to update admin user:');
  console.log(`UPDATE admin_users SET password_hash = '${passwordHash}' WHERE email = '${email}';`);
}

createAdminUser().catch(console.error);

