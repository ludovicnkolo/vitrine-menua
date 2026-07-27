const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function runTest() {
  try {
    console.log("1. Authenticating as Master Admin...");
    const MASTER_EMAIL = process.env.MASTER_ADMIN_EMAIL || 'r.fouelefack@menuaconsulting.com';
    const MASTER_PASS = process.env.MASTER_ADMIN_PASSWORD || 'Menua2026?consulting';
    
    // Simulate login to get token
    const resAuth = await fetch('http://localhost:4000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: MASTER_EMAIL, password: MASTER_PASS })
    });
    const authData = await resAuth.json();
    if (!authData.success) throw new Error("Login failed: " + authData.error);
    const token = authData.token;
    console.log("✅ Logged in successfully.");

    // 2. Create a Dossier
    console.log("2. Creating a Dossier...");
    const resDossier = await fetch('http://localhost:4000/api/crm/dossiers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ name: 'Dossier de Test API', description: 'Test', origin: 'MESSAGERIE' })
    });
    const dossier = await resDossier.json();
    console.log(`✅ Dossier created:`, { id: dossier.id, reference: dossier.reference });

    // 3. Create a Mission
    console.log("3. Creating a Mission...");
    const resMission = await fetch('http://localhost:4000/api/crm/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ dossierId: dossier.id, description: 'Mission de Test', status: 'NEW' })
    });
    const mission = await resMission.json();
    const missionIdStr = String(mission.id);
    if (!/^[0-9a-fA-F-]+$/.test(missionIdStr)) {
      throw new Error("ID de mission invalide");
    }
    const safeMissionId = missionIdStr;
    console.log(`✅ Mission created:`, { id: safeMissionId, reference: mission.reference, status: mission.status });

    // 4. Update Status to EN_COURS
    console.log("4. Updating status to EN_COURS...");
    const taskUrl1 = new URL(`http://localhost:4000/api/crm/tasks/${encodeURIComponent(safeMissionId)}`);
    const resUpdate1 = await fetch(taskUrl1.toString(), {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ status: 'EN_COURS' })
    });
    const missionUpdate1 = await resUpdate1.json();
    console.log(`✅ Status updated to:`, { status: missionUpdate1.status, previous: missionUpdate1.previousStatus });

    // 5. Update Status to EN_FINALISATION
    console.log("5. Updating status to EN_FINALISATION...");
    const taskUrl2 = new URL(`http://localhost:4000/api/crm/tasks/${encodeURIComponent(safeMissionId)}`);
    const resUpdate2 = await fetch(taskUrl2.toString(), {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ status: 'EN_FINALISATION' })
    });
    const missionUpdate2 = await resUpdate2.json();
    console.log(`✅ Status updated to:`, { status: missionUpdate2.status, previous: missionUpdate2.previousStatus });
    
    // 6. Update Status to TERMINEE
    console.log("6. Updating status to TERMINEE...");
    const taskUrl3 = new URL(`http://localhost:4000/api/crm/tasks/${encodeURIComponent(safeMissionId)}`);
    const resUpdate3 = await fetch(taskUrl3.toString(), {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ status: 'TERMINEE' })
    });
    const missionUpdate3 = await resUpdate3.json();
    console.log(`✅ Status updated to:`, { status: missionUpdate3.status, previous: missionUpdate3.previousStatus });

    console.log("\n🎉 All tests passed successfully!");
    
    // Cleanup
    await prisma.mission.delete({ where: { id: safeMissionId }});
    await prisma.dossier.delete({ where: { id: dossier.id }});
    console.log("🧹 Cleanup done.");

  } catch (error) {
    console.error("❌ Test failed:", error);
  }
}

runTest();
