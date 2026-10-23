const mysql = require('mysql2/promise');

async function main() {
  const conn = await mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'sawera_store_db',
  });

  await conn.query(`
    UPDATE store_settings 
    SET storeName = 'ROYAL SHOES',
        storeTagline = 'STEP INTO ELEGANCE',
        easypaisaInstructions = 'Transfer to ROYAL SHOES Official Easypaisa Account: 03481702710 (Title: ROYAL SHOES) and enter transaction ID below.',
        bankInstructions = 'Bank: Meezan Bank Ltd | Account Title: ROYAL SHOES ATELIER | IBAN: PK55MEZN0001234567890123',
        announcementText = 'ROYAL SHOES — COMPLIMENTARY NATIONWIDE EXPRESS DELIVERY ON ORDERS OVER RS. 5,000'
    WHERE id = 'singleton'
  `);

  console.log("Database store_settings updated successfully to ROYAL SHOES!");
  await conn.end();
}

main().catch(console.error);
