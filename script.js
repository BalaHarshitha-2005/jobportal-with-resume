document.addEventListener('DOMContentLoaded', () => {
    // Helper function to get elements
    const getEl = (selector) => document.querySelector(selector);
    const getEls = (selector) => document.querySelectorAll(selector);

    // --- DOM Elements ---
    const header = getEl('.header');
    const navList = getEl('.header__nav-list');
    const authButtons = getEl('#auth-buttons');
    const userInfo = getEl('#user-info');
    const mobileMenuBtn = getEl('.header__mobile-menu-btn');
    const navLinks = getEls('.header__nav-link');
    const sections = getEls('section');

    // Modals
    const loginModal = getEl('#login-modal');
    const registerModal = getEl('#register-modal');
    const applyModal = getEl('#apply-modal');
    const modals = getEls('.modal');
    
    // Modal buttons
    const loginBtn = getEl('#login-btn');
    const registerBtn = getEl('#register-btn');
    const switchToRegisterBtn = getEl('#switch-to-register');
    const switchToLoginBtn = getEl('#switch-to-login');
    
    // Forms and inputs
    const loginForm = getEl('#login-form');
    const registerForm = getEl('#register-form');
    const resumeUploadForm = getEl('#resume-upload-form');
    const resumeFile = getEl('#resume-file');
    const fileName = getEl('#file-name');
    const uploadSubmitBtn = getEl('.upload-submit');
    const uploadStatus = getEl('#upload-status');
    const applyForm = getEl('#apply-form');
    const applyJobTitle = getEl('#apply-job-title');
    const applyStatus = getEl('#apply-status');
    const logoutBtn = getEl('#logout-btn');

    // Containers
    const jobCardsContainer = getEl('#job-cards-container');
    const emptyState = getEl('.job-listings__empty-state');
    const userAvatar = getEl('#user-avatar');
    const usernameSpan = getEl('#username');
    const myApplicationsLink = getEl('#my-applications-link');
    const myApplicationsSection = getEl('#my-applications');
    const applicationsList = getEl('#applications-list');
    const noApplicationsState = getEl('#no-applications-state');

    // Job Data (Mock Data)
    const mockJobs = [
        { id: 1, title: 'Senior Software Engineer', company: 'Tech Innovators Inc.', location: 'San Francisco, CA', type: 'full-time', industry: 'technology' },
        { id: 2, title: 'UX/UI Designer', company: 'Creative Solutions', location: 'Remote', type: 'full-time', industry: 'design' },
        { id: 3, title: 'Registered Nurse', company: 'City General Hospital', location: 'New York, NY', type: 'full-time', industry: 'healthcare' },
        { id: 4, title: 'Financial Analyst', company: 'Global Finance Group', location: 'Chicago, IL', type: 'contract', industry: 'finance' },
        { id: 5, title: 'Marketing Manager', company: 'BrandSpark Agency', location: 'New York, NY', type: 'full-time', industry: 'marketing' },
        { id: 6, title: 'Data Scientist', company: 'Data Insights Co.', location: 'San Francisco, CA', type: 'full-time', industry: 'technology' },
        { id: 7, title: 'Project Manager', company: 'Innovate Corp.', location: 'Chicago, IL', type: 'part-time', industry: 'technology' },
        { id: 8, title: 'Elementary School Teacher', company: 'Springfield School District', location: 'Remote', type: 'full-time', industry: 'education' },
    ];

    let user = JSON.parse(localStorage.getItem('user')) || null;
    let currentJobId = null;

    // --- Helper Functions ---
    const showModal = (modal) => {
        modal.style.display = 'block';
        setTimeout(() => modal.classList.add('is-open'), 10);
        modal.querySelector('.modal__content').focus(); // Focus the modal content
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    };

    const hideModal = (modal) => {
        modal.classList.remove('is-open');
        setTimeout(() => modal.style.display = 'none', 400); // Wait for transition
        document.body.style.overflow = '';
    };

    const updateUIForUser = () => {
        if (user) {
            authButtons.style.display = 'none';
            userInfo.style.display = 'flex';
            myApplicationsLink.style.display = 'block';
            usernameSpan.textContent = user.name;
            userAvatar.textContent = user.name.split(' ').map(n => n[0]).join('');
            displayApplications();
        } else {
            authButtons.style.display = 'flex';
            userInfo.style.display = 'none';
            myApplicationsLink.style.display = 'none';
            myApplicationsSection.style.display = 'none';
        }
    };
    
    const displayJobs = (jobs, container) => {
        container.innerHTML = '';
        if (jobs.length === 0) {
            emptyState.style.display = 'block';
            return;
        }
        emptyState.style.display = 'none';
        jobs.forEach(job => {
            const jobCard = document.createElement('div');
            jobCard.className = 'job-card';
            jobCard.innerHTML = `
                <div class="job-card__header">
                    <h3 class="job-card__title">${job.title}</h3>
                    <p class="job-card__company">${job.company}</p>
                </div>
                <div class="job-card__details">
                    <div class="job-card__detail">
                        <i class="fas fa-map-marker-alt job-card__detail-icon"></i>
                        <span>${job.location}</span>
                    </div>
                    <div class="job-card__detail">
                        <i class="fas fa-briefcase job-card__detail-icon"></i>
                        <span>${job.type}</span>
                    </div>
                    <div class="job-card__detail">
                        <i class="fas fa-industry job-card__detail-icon"></i>
                        <span>${job.industry.charAt(0).toUpperCase() + job.industry.slice(1)}</span>
                    </div>
                </div>
                <div class="job-card__actions">
                    <button class="btn btn--primary job-card__apply-btn" data-job-id="${job.id}">Apply Now</button>
                </div>
            `;
            container.appendChild(jobCard);
        });

        // Re-attach event listeners for apply buttons
        getEls('.job-card__apply-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                if (!user) {
                    showModal(loginModal);
                    return;
                }
                const jobId = e.target.dataset.jobId;
                const job = mockJobs.find(j => j.id == jobId);
                if (job) {
                    applyJobTitle.textContent = job.title;
                    currentJobId = jobId;
                    showModal(applyModal);
                }
            });
        });
    };
    
    const displayApplications = () => {
        if (!user || !user.applications || user.applications.length === 0) {
            applicationsList.innerHTML = '';
            noApplicationsState.style.display = 'block';
            return;
        }

        noApplicationsState.style.display = 'none';
        applicationsList.innerHTML = '';
        
        user.applications.forEach(app => {
            const applicationCard = document.createElement('div');
            applicationCard.className = 'application-card';
            applicationCard.innerHTML = `
                <div class="application-card__info">
                    <h4 class="application-card__job-title">${app.jobTitle}</h4>
                    <p class="application-card__company-name">${app.company}</p>
                    <p class="application-card__date">Applied on: ${app.dateApplied}</p>
                </div>
                <span class="application-card__status submitted">Submitted</span>
            `;
            applicationsList.appendChild(applicationCard);
        });
    };

    // --- Event Listeners ---
    // Mobile menu toggle
    mobileMenuBtn.addEventListener('click', () => {
        navList.classList.toggle('is-active');
        authButtons.classList.toggle('is-active');
        if (user) {
            userInfo.classList.toggle('is-active');
        }
    });

    // Modal open/close
    loginBtn.addEventListener('click', () => showModal(loginModal));
    registerBtn.addEventListener('click', () => showModal(registerModal));
    switchToRegisterBtn.addEventListener('click', (e) => {
        e.preventDefault();
        hideModal(loginModal);
        showModal(registerModal);
    });
    switchToLoginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        hideModal(registerModal);
        showModal(loginModal);
    });
    getEls('.modal__close-btn').forEach(btn => {
        btn.addEventListener('click', () => hideModal(btn.closest('.modal')));
    });

    window.addEventListener('click', (e) => {
        modals.forEach(modal => {
            if (e.target === modal) {
                hideModal(modal);
            }
        });
    });

    // Keyboard accessibility for modals
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            modals.forEach(modal => {
                if (modal.style.display === 'block') {
                    hideModal(modal);
                }
            });
        }
    });

    // Forms
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = getEl('#login-email').value;
        const password = getEl('#login-password').value;
        // Mock login logic
        if (email === 'test@example.com' && password === 'password123') {
            // Check if user has applied jobs data stored
            const storedUser = JSON.parse(localStorage.getItem('testUser'));
            user = storedUser || { name: 'Test User', email: email, applications: [] };
            localStorage.setItem('user', JSON.stringify(user));
            updateUIForUser();
            hideModal(loginModal);
        } else {
            alert('Invalid email or password.');
        }
    });

    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = getEl('#register-name').value;
        const email = getEl('#register-email').value;
        const password = getEl('#register-password').value;
        const confirmPassword = getEl('#register-confirm-password').value;

        if (password !== confirmPassword) {
            alert('Passwords do not match.');
            return;
        }

        user = { name, email, applications: [] };
        localStorage.setItem('user', JSON.stringify(user));
        // Also save a separate entry for the mock user to simulate "persisting" data
        localStorage.setItem('testUser', JSON.stringify(user));
        
        updateUIForUser();
        hideModal(registerModal);
        alert('Registration successful! You are now logged in.');
    });

    // Resume Upload
    resumeFile.addEventListener('change', () => {
        if (resumeFile.files.length > 0) {
            fileName.textContent = resumeFile.files[0].name;
            uploadSubmitBtn.style.display = 'inline-block';
        } else {
            fileName.textContent = '';
            uploadSubmitBtn.style.display = 'none';
        }
    });

    resumeUploadForm.addEventListener('submit', (e) => {
        e.preventDefault();
        uploadStatus.style.display = 'block';
        const file = resumeFile.files[0];
        if (!file) {
            uploadStatus.className = 'status-message error';
            uploadStatus.textContent = 'Please select a file to upload.';
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            uploadStatus.className = 'status-message error';
            uploadStatus.textContent = 'File size exceeds 5MB. Please choose a smaller file.';
            return;
        }

        // Simulate upload
        uploadStatus.className = 'status-message success';
        uploadStatus.textContent = `File "${file.name}" uploaded successfully!`;
        resumeUploadForm.reset();
        fileName.textContent = '';
        uploadSubmitBtn.style.display = 'none';
    });
    
    // Job filtering
    const filters = getEls('.job-filters__select, .job-filters__input');
    filters.forEach(filter => {
        filter.addEventListener('change', filterJobs);
        filter.addEventListener('input', filterJobs);
    });
    
    function filterJobs() {
        const industry = getEl('#industry-filter').value;
        const location = getEl('#location-filter').value;
        const type = getEl('#type-filter').value;
        const keyword = getEl('#keyword-filter').value.toLowerCase();

        const filtered = mockJobs.filter(job => {
            const matchesIndustry = industry === 'all' || job.industry === industry;
            const matchesLocation = location === 'all' || job.location.includes(location);
            const matchesType = type === 'all' || job.type === type;
            const matchesKeyword = job.title.toLowerCase().includes(keyword) || job.company.toLowerCase().includes(keyword) || job.location.toLowerCase().includes(keyword);
            return matchesIndustry && matchesLocation && matchesType && matchesKeyword;
        });

        displayJobs(filtered, jobCardsContainer);
    }

    // Job application form
    applyForm.addEventListener('submit', (e) => {
        e.preventDefault();
        applyStatus.style.display = 'block';
        
        // Mock submission
        setTimeout(() => {
            // Get job details from the mock data
            const job = mockJobs.find(j => j.id == currentJobId);
            if (job && user) {
                // Create a new application object
                const newApplication = {
                    jobId: job.id,
                    jobTitle: job.title,
                    company: job.company,
                    dateApplied: new Date().toLocaleDateString(),
                    status: 'Submitted'
                };

                // Add to user's applications array
                user.applications = user.applications || [];
                user.applications.push(newApplication);

                // Save to localStorage (our mock database)
                localStorage.setItem('user', JSON.stringify(user));
                localStorage.setItem('testUser', JSON.stringify(user));
                
                // Update UI to show the new application
                displayApplications();
            }

            applyStatus.className = 'status-message success';
            applyStatus.textContent = `Your application for "${applyJobTitle.textContent}" has been submitted!`;
            applyForm.reset();
            setTimeout(() => {
                hideModal(applyModal);
                applyStatus.style.display = 'none';
            }, 2000);
        }, 1000);
    });

    // Header smooth scrolling and active state
    myApplicationsLink.addEventListener('click', (e) => {
        e.preventDefault();
        myApplicationsSection.style.display = 'block';
        myApplicationsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Set "My Applications" as active
        navLinks.forEach(link => link.classList.remove('active'));
        myApplicationsLink.classList.add('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            if (link.dataset.section) {
                e.preventDefault();
                const targetId = link.dataset.section;
                const targetSection = getEl(`#${targetId}`);
                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const sectionId = entry.target.id;
            const navLink = getEl(`[data-section="${sectionId}"]`);
            if (entry.isIntersecting) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (navLink) {
                    navLink.classList.add('active');
                }
            }
        });
    }, {
        root: null,
        rootMargin: '0px',
        threshold: 0.5,
    });

    sections.forEach(section => observer.observe(section));

    // Logout
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('user');
        user = null;
        updateUIForUser();
        // Redirect to homepage or refresh
        window.location.href = window.location.pathname; 
    });

    // Initial load
    updateUIForUser();
    displayJobs(mockJobs, jobCardsContainer);
});