const fs = require('fs');
const path = require('path');

// Lire le contenu de policies-data.ts
const content = fs.readFileSync(path.join(__dirname, '../web/src/lib/policies-data.ts'), 'utf8');

// Extraire les textes
const cguMatch = content.match(/cgu:\s*\{[\s\S]*?content:\s*`([\s\S]*?)`/);
const cgvMatch = content.match(/cgv:\s*\{[\s\S]*?content:\s*`([\s\S]*?)`/);
const legalMatch = content.match(/legal:\s*\{[\s\S]*?content:\s*`([\s\S]*?)`/);
const gdprMatch = content.match(/gdpr:\s*\{[\s\S]*?content:\s*`([\s\S]*?)`/);
const cookiesMatch = content.match(/cookies:\s*\{[\s\S]*?content:\s*`([\s\S]*?)`/);

const policies = {
  cgu: cguMatch ? cguMatch[1] : '',
  cgv: cgvMatch ? cgvMatch[1] : '',
  legal: legalMatch ? legalMatch[1] : '',
  gdpr: gdprMatch ? gdprMatch[1] : '',
  cookies: cookiesMatch ? cookiesMatch[1] : '',
};

let sql = '';
for (const [slug, text] of Object.entries(policies)) {
  const escaped = text.replace(/'/g, "''");
  sql += `INSERT INTO "SystemSettings" (id, key, value, "updatedAt") VALUES (gen_random_uuid(), 'policy_${slug}', '${escaped}', NOW()) ON CONFLICT (key) DO UPDATE SET value = '${escaped}', "updatedAt" = NOW();\n`;
}

fs.writeFileSync('/tmp/update_policies.sql', sql);
console.log('SQL generated, length:', sql.length);
