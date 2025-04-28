const API_URL = "http://localhost:5000/api"; // তোমার সার্ভারের URL

// Helper: Get Token
function getToken() {
    return localStorage.getItem('token');
}

// Helper: Set Token
function setToken(token) {
    localStorage.setItem('token', token);
}

// Helper: Logout
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.href = "login.html";
    });
}

// Login
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const identifier = document.getElementById('identifier').value;
        const password = document.getElementById('password').value;

        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ identifier, password })
        });

        const data = await res.json();
        if (res.ok) {
            setToken(data.token);
            alert('Login successful!');
            window.location.href = "feed.html";
        } else {
            alert(data);
        }
    });
}

// Register
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const res = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });

        if (res.ok) {
            alert('Registration successful!');
            window.location.href = "login.html";
        } else {
            alert('Registration failed!');
        }
    });
}

// Create Post
const createPostBtn = document.getElementById('createPostBtn');
if (createPostBtn) {
    createPostBtn.addEventListener('click', async () => {
        const desc = document.getElementById('postDesc').value;
        const img = document.getElementById('postImage').files[0];
        const video = document.getElementById('postVideo').files[0];

        const formData = new FormData();
        formData.append('desc', desc);
        if (img) formData.append('img', img);
        if (video) formData.append('video', video);

        const res = await fetch(`${API_URL}/posts`, {
            method: 'POST',
            headers: {
                'token': `Bearer ${getToken()}`
            },
            body: formData
        });

        if (res.ok) {
            alert('Post created!');
            window.location.reload();
        } else {
            alert('Post failed!');
        }
    });
}

// Load Posts
async function loadPosts() {
    const postsArea = document.getElementById('postsArea');
    if (postsArea) {
        const res = await fetch(`${API_URL}/posts`, {
            headers: {
                'token': `Bearer ${getToken()}`
            }
        });
        const posts = await res.json();
        postsArea.innerHTML = posts.map(post => `
            <div class="post">
                <p>${post.desc}</p>
                ${post.img ? `<img src="../uploads/${post.img}" alt="Post Image">` : ''}
                ${post.video ? `<video controls src="../uploads/${post.video}"></video>` : ''}
                <button onclick="likePost('${post._id}')">Love (${post.likes.length})</button>
            </div>
        `).join('');
    }
}
loadPosts();

// Like Post
async function likePost(postId) {
    const res = await fetch(`${API_URL}/posts/${postId}/like`, {
        method: 'PUT',
        headers: {
            'token': `Bearer ${getToken()}`
        }
    });
    if (res.ok) {
        window.location.reload();
    }
}

// Admin: Load Users & Reports
async function loadAdminData() {
    const userList = document.getElementById('userList');
    const reportList = document.getElementById('reportList');
    if (userList && reportList) {
        // Users
        const userRes = await fetch(`${API_URL}/admin/users`, {
            headers: {
                'token': `Bearer ${getToken()}`
            }
        });
        const users = await userRes.json();
        userList.innerHTML = users.map(u => `
            <div>
                @${u.username} - ${u.email} 
                <button onclick="banUser('${u._id}')">Ban</button>
                <button onclick="verifyUser('${u._id}')">Verify</button>
            </div>
        `).join('');

        // Reports
        const reportRes = await fetch(`${API_URL}/admin/reports`, {
            headers: {
                'token': `Bearer ${getToken()}`
            }
        });
        const reports = await reportRes.json();
        reportList.innerHTML = reports.map(r => `
            <div>
                Reporter: @${r.reporterId.username} <br>
                Reported: @${r.reportedUserId.username} <br>
                Reason: ${r.reason}
            </div>
        `).join('');
    }
}
loadAdminData();

// Admin: Ban User
async function banUser(userId) {
    const res = await fetch(`${API_URL}/admin/ban/${userId}`, {
        method: 'PUT',
        headers: {
            'token': `Bearer ${getToken()}`
        }
    });
    if (res.ok) {
        alert('User banned!');
        window.location.reload();
    }
}

// Admin: Verify User
async function verifyUser(userId) {
    const res = await fetch(`${API_URL}/admin/verify/${userId}`, {
        method: 'PUT',
        headers: {
            'token': `Bearer ${getToken()}`
        }
    });
    if (res.ok) {
        alert('User verified!');
        window.location.reload();
    }
}