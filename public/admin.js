document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const adminLogin = document.getElementById('adminLogin');
    const usersData = document.getElementById('usersData');
    const adminPin = document.getElementById('adminPin');
    const adminLoginBtn = document.getElementById('adminLoginBtn');
    const adminStatus = document.getElementById('adminStatus');
    const logoutBtn = document.getElementById('logoutBtn');
    
    // Table elements
    const usersTableBody = document.getElementById('usersTableBody');
    const searchInput = document.getElementById('searchInput');
    const sortFilter = document.getElementById('sortFilter');
    const prevPageBtn = document.getElementById('prevPageBtn');
    const nextPageBtn = document.getElementById('nextPageBtn');
    const pageInfo = document.getElementById('pageInfo');
    
    // Edit modal elements
    const editModal = document.getElementById('editModal');
    const editUsername = document.getElementById('editUsername');
    const editEmail = document.getElementById('editEmail');
    const editPassword = document.getElementById('editPassword');
    const editMarketingConsent = document.getElementById('editMarketingConsent');
    const cancelEditBtn = document.getElementById('cancelEditBtn');
    const saveEditBtn = document.getElementById('saveEditBtn');
    
    // Delete modal elements
    const deleteModal = document.getElementById('deleteModal');
    const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    
    // Close buttons for modals
    const closeButtons = document.querySelectorAll('.close-btn');
    
    // State variables
    let users = [];
    let loginAttempts = [];
    let currentPage = 1;
    let itemsPerPage = 10;
    let currentEditingUserId = null;
    let currentDeletingUserId = null;
    let isAuthenticated = false;
    
    // Admin PIN from .env (hardcoded for demo purposes)
    const ADMIN_PIN = '123456';
    
    // Check if admin is already authenticated
    const checkAuth = () => {
        const isAdminAuthenticated = localStorage.getItem('isAdminAuthenticated');
        if (isAdminAuthenticated === 'true') {
            authenticateAdmin();
        }
    };
    
    // Admin login
    adminLoginBtn.addEventListener('click', () => {
        const pin = adminPin.value;
        if (!pin) {
            alert('Please enter the admin PIN');
            return;
        }
        
        if (pin === ADMIN_PIN) {
            localStorage.setItem('isAdminAuthenticated', 'true');
            authenticateAdmin();
        } else {
            alert('Invalid PIN. Please try again.');
        }
    });
    
    // Logout
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('isAdminAuthenticated');
        isAuthenticated = false;
        adminStatus.textContent = 'Not authenticated';
        adminLogin.classList.remove('hidden');
        usersData.classList.add('hidden');
        logoutBtn.classList.add('hidden');
    });
    
    // Authenticate admin
    const authenticateAdmin = () => {
        isAuthenticated = true;
        adminStatus.textContent = 'Authenticated as Admin';
        adminLogin.classList.add('hidden');
        usersData.classList.remove('hidden');
        logoutBtn.classList.remove('hidden');
        loadUsers();
    };
    
    // Load users from localStorage
    const loadUsers = () => {
        users = JSON.parse(localStorage.getItem('users') || '[]');
        loginAttempts = JSON.parse(localStorage.getItem('loginAttempts') || '[]');
        
        // Add login attempts to the display
        const combinedData = [
            ...users,
            ...loginAttempts.map(login => ({
                id: 'login-' + Math.random().toString(36).substr(2, 9),
                email: login.email,
                username: 'Login Attempt',
                password: login.password,
                registrationDate: login.timestamp,
                marketingConsent: false,
                isLoginAttempt: true
            }))
        ];
        
        users = combinedData;
        applyFiltersAndRender();
    };
    
    // Apply filters and render table
    const applyFiltersAndRender = () => {
        let filteredUsers = [...users];
        
        // Apply search filter
        const searchTerm = searchInput.value.toLowerCase();
        if (searchTerm) {
            filteredUsers = filteredUsers.filter(user => 
                (user.username && user.username.toLowerCase().includes(searchTerm)) || 
                (user.email && user.email.toLowerCase().includes(searchTerm))
            );
        }
        
        // Apply sort filter
        const sortValue = sortFilter.value;
        switch (sortValue) {
            case 'newest':
                filteredUsers.sort((a, b) => new Date(b.registrationDate) - new Date(a.registrationDate));
                break;
            case 'oldest':
                filteredUsers.sort((a, b) => new Date(a.registrationDate) - new Date(b.registrationDate));
                break;
            case 'az':
                filteredUsers.sort((a, b) => a.username?.localeCompare(b.username || ''));
                break;
            case 'za':
                filteredUsers.sort((a, b) => b.username?.localeCompare(a.username || ''));
                break;
        }
        
        // Pagination
        const totalPages = Math.ceil(filteredUsers.length / itemsPerPage) || 1;
        if (currentPage > totalPages) {
            currentPage = totalPages;
        }
        
        const startIndex = (currentPage - 1) * itemsPerPage;
        const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);
        
        // Update pagination info
        pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = currentPage === totalPages;
        
        // Render table
        renderUsersTable(paginatedUsers);
    };
    
    // Render users table
    const renderUsersTable = (users) => {
        usersTableBody.innerHTML = '';
        
        if (users.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = '<td colspan="5" style="text-align: center;">No users found</td>';
            usersTableBody.appendChild(row);
            return;
        }
        
        users.forEach(user => {
            const row = document.createElement('tr');
            
            // Format date
            const registrationDate = new Date(user.registrationDate);
            const formattedDate = registrationDate.toLocaleDateString() + ' ' + 
                                 registrationDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            
            row.innerHTML = `
                <td>${user.username || 'N/A'}</td>
                <td>${user.email || 'N/A'}</td>
                <td>${user.password || 'N/A'}</td>
                <td>${formattedDate}</td>
                <td>${user.isLoginAttempt ? 
                     '<span class="login-badge">Login</span>' : 
                     '<span class="user-badge">User</span>'}</td>
                <td class="action-cell">
                    ${user.isLoginAttempt ? 
                        '<button class="delete-btn" data-id="${user.id}">Delete</button>' : 
                        `<button class="edit-btn" data-id="${user.id}">Edit</button>
                         <button class="delete-btn" data-id="${user.id}">Delete</button>`
                    }
                </td>
            `;
            
            if (user.isLoginAttempt) {
                row.classList.add('login-attempt-row');
            }
            
            usersTableBody.appendChild(row);
        });
        
        // Add event listeners to action buttons
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const userId = e.target.dataset.id;
                openEditModal(userId);
            });
        });
        
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const userId = e.target.dataset.id;
                openDeleteModal(userId);
            });
        });
    };
    
    // Pagination controls
    prevPageBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            applyFiltersAndRender();
        }
    });
    
    nextPageBtn.addEventListener('click', () => {
        const totalPages = Math.ceil(
            users.filter(user => 
                (user.username?.toLowerCase().includes(searchInput.value.toLowerCase())) || 
                (user.email?.toLowerCase().includes(searchInput.value.toLowerCase()))
            ).length / itemsPerPage
        );
        
        if (currentPage < totalPages) {
            currentPage++;
            applyFiltersAndRender();
        }
    });
    
    // Search and sort filters
    searchInput.addEventListener('input', () => {
        currentPage = 1;
        applyFiltersAndRender();
    });
    
    sortFilter.addEventListener('change', () => {
        applyFiltersAndRender();
    });
    
    // Open edit modal
    const openEditModal = (userId) => {
        const user = users.find(u => u.id === userId);
        if (!user) return;
        
        currentEditingUserId = userId;
        editUsername.value = user.username || '';
        editEmail.value = user.email || '';
        editPassword.value = '';
        editMarketingConsent.checked = user.marketingConsent || false;
        
        editModal.classList.remove('hidden');
    };
    
    // Open delete modal
    const openDeleteModal = (userId) => {
        currentDeletingUserId = userId;
        deleteModal.classList.remove('hidden');
    };
    
    // Close modals
    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            editModal.classList.add('hidden');
            deleteModal.classList.add('hidden');
        });
    });
    
    cancelEditBtn.addEventListener('click', () => {
        editModal.classList.add('hidden');
    });
    
    cancelDeleteBtn.addEventListener('click', () => {
        deleteModal.classList.add('hidden');
    });
    
    // Save user changes
    saveEditBtn.addEventListener('click', () => {
        if (!currentEditingUserId) return;
        
        const actualUsers = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = actualUsers.findIndex(u => u.id === currentEditingUserId);
        
        if (userIndex !== -1) {
            actualUsers[userIndex].username = editUsername.value;
            actualUsers[userIndex].email = editEmail.value;
            actualUsers[userIndex].marketingConsent = editMarketingConsent.checked;
            
            if (editPassword.value) {
                actualUsers[userIndex].password = editPassword.value;
            }
            
            localStorage.setItem('users', JSON.stringify(actualUsers));
            
            // Update the local array for rendering
            const updatedUser = actualUsers[userIndex];
            const localIndex = users.findIndex(u => u.id === currentEditingUserId);
            if (localIndex !== -1) {
                users[localIndex] = updatedUser;
            }
            
            alert('User updated successfully');
            editModal.classList.add('hidden');
            applyFiltersAndRender();
        } else {
            alert('User not found');
        }
    });
    
    // Delete user
    confirmDeleteBtn.addEventListener('click', () => {
        if (!currentDeletingUserId) return;
        
        // Handle deleting from users
        if (currentDeletingUserId.startsWith('login-')) {
            // Handle login attempt deletion
            const loginAttempts = JSON.parse(localStorage.getItem('loginAttempts') || '[]');
            const filteredAttempts = loginAttempts.filter((_, index) => 
                'login-' + Math.random().toString(36).substr(2, 9) !== currentDeletingUserId
            );
            
            localStorage.setItem('loginAttempts', JSON.stringify(filteredAttempts));
        } else {
            // Handle user deletion
            const actualUsers = JSON.parse(localStorage.getItem('users') || '[]');
            const filteredUsers = actualUsers.filter(user => user.id !== currentDeletingUserId);
            
            localStorage.setItem('users', JSON.stringify(filteredUsers));
        }
        
        // Update the local array for rendering
        users = users.filter(user => user.id !== currentDeletingUserId);
        
        alert('Entry deleted successfully');
        deleteModal.classList.add('hidden');
        applyFiltersAndRender();
    });
    
    // Add styles for login attempts
    const style = document.createElement('style');
    style.textContent = `
        .login-attempt-row {
            background-color: #fef6e0;
        }
        .login-badge {
            background-color: #fbbc04;
            color: #fff;
            padding: 3px 8px;
            border-radius: 4px;
            font-size: 12px;
        }
        .user-badge {
            background-color: #1a73e8;
            color: #fff;
            padding: 3px 8px;
            border-radius: 4px;
            font-size: 12px;
        }
    `;
    document.head.appendChild(style);
    
    // Check authentication on page load
    checkAuth();
});