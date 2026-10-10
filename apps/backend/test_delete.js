async function test() {
  const loginRes = await fetch("http://localhost:4000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "r.fouelefack@menuaconsulting.com", password: "123456@w" })
  });
  const loginData = await loginRes.json();
  const token = loginData.token;
  console.log("Logged in, token:", token.substring(0, 20) + "...");

  const delRes = await fetch("http://localhost:4000/api/crm/dossiers/472b282b-1eb6-47af-b53b-59143f9b6f57", {
    method: "DELETE",
    headers: { "Authorization": `Bearer ${token}` }
  });
  console.log("Delete status:", delRes.status);
  const delData = await delRes.text();
  console.log("Delete response:", delData);
}
test();
