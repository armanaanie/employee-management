const runTest = async () => {
  try {
    console.log("Logging in...");
    const loginRes = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "admin@example.com", password: "password123" })
    });
    const loginData = await loginRes.json();
    console.log("Login response:", loginRes.status, loginData);

    if (!loginData.token) return;

    console.log("Adding employee...");
    const empRes = await fetch("http://localhost:5000/api/employees", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${loginData.token}`
      },
      body: JSON.stringify({
        name: "API Test User",
        email: "api@test.com",
        role: "Dev",
        department: "Engineering",
        status: "Active",
        joinDate: "2023-01-01",
        avatar: "",
        id: "123"
      })
    });
    const empData = await empRes.json();
    console.log("Add Employee response:", empRes.status, empData);

  } catch (err) {
    console.error("Test failed:", err);
  }
};
runTest();
