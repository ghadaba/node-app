const API = "http://localhost:5000/api";

// Vérifier si token existe
if (localStorage.getItem("token")) {
    showPosts();
}

function saveToken(token) {
    localStorage.setItem("token", token);
}

function logout() {
    localStorage.removeItem("token");
    location.reload();
}

// REGISTER avec message si email déjà utilisé
async function register() {
    const res = await fetch(`${API}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: document.getElementById("name").value,
            email: document.getElementById("email").value,
            password: document.getElementById("password").value
        })
    });

    const data = await res.json();

    if (res.status === 201) {
        alert("✅ Registered! Maintenant connectez-vous.");
    } else {
        alert("❌ " + (data.message || "L’utilisateur existe déjà ou erreur"));
    }
}

// LOGIN
async function login() {
    const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            email: document.getElementById("email").value,
            password: document.getElementById("password").value
        })
    });

    const data = await res.json();

    if (data.token) {
        saveToken(data.token);
        showPosts();
    } else {
        alert("❌ " + (data.message || "Email ou mot de passe incorrect"));
    }
}

// Afficher posts
function showPosts() {
    document.getElementById("auth-section").classList.add("hidden");
    document.getElementById("post-section").classList.remove("hidden");
    loadPosts();
}

// CREATE POST
async function createPost() {
    const title = document.getElementById("title").value;
    const content = document.getElementById("content").value;

    await fetch(`${API}/posts`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token")
        },
        body: JSON.stringify({ title, content })
    });

    document.getElementById("title").value = "";
    document.getElementById("content").value = "";
    loadPosts();
}

// LOAD POSTS
async function loadPosts() {
    const res = await fetch(`${API}/posts`, {
        headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
        }
    });

    const posts = await res.json();
    const container = document.getElementById("posts");
    container.innerHTML = "";

    posts.forEach(post => {
        container.innerHTML += `
      <div class="post-card">
        <h3>${post.title}</h3>
        <p>${post.content}</p>
        <button onclick="updatePostPrompt('${post._id}', '${post.title}', '${post.content}')">Edit</button>
        <button onclick="deletePost('${post._id}')">Delete</button>
      </div>
    `;
    });
}

// DELETE POST
async function deletePost(id) {
    await fetch(`${API}/posts/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
        }
    });

    loadPosts();
}

// UPDATE POST (via prompt)
async function updatePostPrompt(id, oldTitle, oldContent) {
    const title = prompt("Modifier le titre :", oldTitle);
    if (title === null) return; // Cancel
    const content = prompt("Modifier le contenu :", oldContent);
    if (content === null) return; // Cancel

    await fetch(`${API}/posts/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token")
        },
        body: JSON.stringify({ title, content })
    });

    loadPosts();
}