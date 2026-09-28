async function test() {
  const loginRes = await fetch('http://localhost:4000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'r.fouelefack@menuaconsulting.com', password: 'Menua2026?consulting' })
  });
  const { token } = await loginRes.json();
  console.log("Token:", !!token);
  
  const usersRes = await fetch('http://localhost:4000/api/crm/users', {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await usersRes.text();
  console.log("Users:", data.substring(0, 500));
}
test();
