const jwt = require("jsonwebtoken");

const token = jwt.sign({ id: "MASTER-ADMIN", role: "Super-administrateur" }, process.env.JWT_SECRET || "fallback", { expiresIn: "1h" });

async function test() {
  const res = await fetch("http://localhost:4000/api/crm/roles", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    },
    body: JSON.stringify({
      name: "TEST_ROLE_2",
      description: "Test description",
      status: "Actif",
      permissions: "[]"
    })
  });
  const data = await res.json();
  console.log(res.status, data);
}
test();
