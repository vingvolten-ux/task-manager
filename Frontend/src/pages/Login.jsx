const login = async () => {
  const res = await fetch("postgresql://task_manager_12h6_user:zHJF7YFIjSho7XUR0uqRXpll7fHFcHj3@dpg-d7ntcku8bjmc7392vg90-a/task_manager_12h6", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (data.token) {
    localStorage.setItem("token", data.token);
  }
};