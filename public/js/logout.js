document
  .getElementById("logout-btn")
  .addEventListener("click", async (event) => {
    event.preventDefault();

    const response = await fetch("/api/users/logout", {
      method: "POST",
    });

    if (response.ok) {
      document.location.replace("/");
    } else {
      alert("Failed to log out.");
    }
  });
