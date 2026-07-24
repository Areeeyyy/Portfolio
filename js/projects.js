/* =============================================
   PROJECTS.JS — Markdown Loader, Parser & Renderer
   Handles both Projects and Certifications
   ============================================= */

(function () {
    'use strict';

    // ---- Configuration ----
    const PROJECTS_DIR = 'projects';
    const CERTS_DIR = 'certifications';

    // ---- Frontmatter Parser ----
    function parseFrontmatter(content) {
        const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)/);
        if (!match) return { meta: {}, body: content };

        const meta = {};
        const lines = match[1].split('\n');

        for (const line of lines) {
            const colonIdx = line.indexOf(':');
            if (colonIdx === -1) continue;

            const key = line.slice(0, colonIdx).trim();
            let value = line.slice(colonIdx + 1).trim();

            // Parse arrays: [item1, item2, item3]
            if (value.startsWith('[') && value.endsWith(']')) {
                value = value
                    .slice(1, -1)
                    .split(',')
                    .map(s => s.trim())
                    .filter(Boolean);
            }
            // Parse booleans
            else if (value === 'true') value = true;
            else if (value === 'false') value = false;

            meta[key] = value;
        }

        return { meta, body: match[2].trim() };
    }

    // ---- Fetch Manifest & Markdown Files ----
    async function loadMarkdownFiles(dir) {
        try {
            const manifestRes = await fetch(`${dir}/manifest.json`);
            if (!manifestRes.ok) throw new Error(`Failed to load ${dir}/manifest.json`);
            const filenames = await manifestRes.json();

            const filePromises = filenames.map(async (filename) => {
                try {
                    const res = await fetch(`${dir}/${filename}`);
                    if (!res.ok) throw new Error(`Failed to load ${filename}`);
                    const content = await res.text();
                    return parseFrontmatter(content);
                } catch (err) {
                    console.warn(`Skipping ${filename}:`, err.message);
                    return null;
                }
            });

            const results = await Promise.all(filePromises);
            return results.filter(Boolean);
        } catch (err) {
            console.error(`Error loading ${dir}:`, err.message);
            return [];
        }
    }

    // ---- Format Date ----
    function formatDate(dateStr) {
        if (!dateStr) return '';
        const parts = dateStr.split('-');
        const year = parts[0];
        const month = parts[1]
            ? new Date(parts[0], parts[1] - 1).toLocaleString('en', { month: 'short' })
            : '';
        return month ? `${month} ${year}` : year;
    }

    // ---- Render Certification Cards ----
    function renderCertifications(certifications) {
        const container = document.getElementById('certifications-grid');
        if (!container) return;

        // Sort by date (newest first)
        certifications.sort((a, b) => (b.meta.date || '').localeCompare(a.meta.date || ''));

        if (certifications.length === 0) {
            container.innerHTML = '<p style="text-align:center;color:var(--text-tertiary);grid-column:1/-1;">No certifications found. Add .md files to the /certifications folder.</p>';
            return;
        }

        container.innerHTML = certifications.map(cert => {
            const m = cert.meta;
            const credLink = m.credential_url
                ? `<a href="${m.credential_url}" target="_blank" rel="noopener noreferrer" class="cert-link">
                     View Credential
                     <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17L17 7"/><path d="M7 7h10v10"/></svg>
                   </a>`
                : '';

            return `
                <article class="cert-card">
                    <div class="cert-card-header">
                        <div>
                            <h3 class="cert-title">${m.title || 'Untitled Certification'}</h3>
                            <p class="cert-issuer">${m.issuer || ''}</p>
                        </div>
                        <div class="cert-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
                            </svg>
                        </div>
                    </div>
                    ${cert.body ? `<p class="cert-description">${cert.body.split('\n')[0]}</p>` : ''}
                    <div class="cert-meta">
                        <span class="cert-date">${formatDate(m.date)}</span>
                        ${credLink}
                    </div>
                </article>
            `;
        }).join('');
    }

    // ---- Render Project Cards ----
    function renderProjects(projects) {
        const container = document.getElementById('projects-grid');
        if (!container) return;

        // Sort: featured first, then by date (newest first)
        projects.sort((a, b) => {
            if (a.meta.featured && !b.meta.featured) return -1;
            if (!a.meta.featured && b.meta.featured) return 1;
            return (b.meta.date || '').localeCompare(a.meta.date || '');
        });

        if (projects.length === 0) {
            container.innerHTML = '<p style="text-align:center;color:var(--text-tertiary);grid-column:1/-1;">No projects found. Add .md files to the /projects folder.</p>';
            return;
        }

        container.innerHTML = projects.map((project, index) => {
            const m = project.meta;
            const isFeatured = m.featured === true;

            // Tags
            const tags = Array.isArray(m.tags) ? m.tags : [];
            const tagsHtml = tags.map(t => `<span class="project-tag">${t}</span>`).join('');

            // Image
            const imageHtml = m.image
                ? `<img src="${m.image}" alt="${m.title}" loading="lazy">`
                : `<svg class="image-placeholder-icon" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                     <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                   </svg>`;

            // Links
            let linksHtml = '';
            if (m.github) {
                linksHtml += `<a href="${m.github}" target="_blank" rel="noopener noreferrer" class="project-link" onclick="event.stopPropagation()">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                    GitHub
                </a>`;
            }
            if (m.demo) {
                linksHtml += `<a href="${m.demo}" target="_blank" rel="noopener noreferrer" class="project-link" onclick="event.stopPropagation()">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                    Live Demo
                </a>`;
            }

            return `
                <article class="project-card ${isFeatured ? 'project-card-featured' : ''}" data-project-index="${index}">
                    <div class="project-card-image">
                        ${imageHtml}
                        ${isFeatured ? '<span class="featured-badge">★ Featured</span>' : ''}
                    </div>
                    <div class="project-card-body">
                        <h3 class="project-card-title">${m.title || 'Untitled Project'}</h3>
                        <p class="project-card-description">${m.description || ''}</p>
                        <div class="project-card-tags">${tagsHtml}</div>
                        <div class="project-card-links">${linksHtml}</div>
                    </div>
                </article>
            `;
        }).join('');

        // Attach click handlers for modal
        container.querySelectorAll('.project-card').forEach(card => {
            card.addEventListener('click', () => {
                const index = parseInt(card.dataset.projectIndex, 10);
                openProjectModal(projects[index]);
            });
        });
    }

    // ---- Project Detail Modal ----
    const modal = document.getElementById('projectModal');
    const modalBody = document.getElementById('modalBody');
    const modalClose = document.getElementById('modalClose');

    // Active carousel state (for cleanup)
    let activeCarousel = null;

    function buildCarouselHtml(previews) {
        if (!previews || previews.length === 0) return '';

        const slides = previews.map((src, i) =>
            `<div class="carousel-slide"><img src="${src}" alt="Preview ${i + 1}" loading="lazy"></div>`
        ).join('');

        const dots = previews.map((_, i) =>
            `<button class="carousel-dot${i === 0 ? ' active' : ''}" data-index="${i}" aria-label="Go to slide ${i + 1}"></button>`
        ).join('');

        return `
            <div class="carousel" data-count="${previews.length}" id="modalCarousel">
                <div class="carousel-track-wrapper">
                    <div class="carousel-track">
                        ${slides}
                    </div>
                </div>
                <button class="carousel-btn carousel-btn-prev" aria-label="Previous slide">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                </button>
                <button class="carousel-btn carousel-btn-next" aria-label="Next slide">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 6 15 12 9 18"/></svg>
                </button>
                <div class="carousel-dots">
                    ${dots}
                </div>
                <div class="carousel-progress" style="width: 0%"></div>
            </div>
        `;
    }

    function initCarousel(container) {
        if (!container) return null;

        const track = container.querySelector('.carousel-track');
        const wrapper = container.querySelector('.carousel-track-wrapper');
        const slides = container.querySelectorAll('.carousel-slide');
        const dots = container.querySelectorAll('.carousel-dot');
        const prevBtn = container.querySelector('.carousel-btn-prev');
        const nextBtn = container.querySelector('.carousel-btn-next');
        const progressBar = container.querySelector('.carousel-progress');
        const count = slides.length;

        if (count <= 1) return null;

        let current = 0;
        let autoplayInterval = null;
        let progressInterval = null;
        let isPaused = false;
        let progressElapsed = 0;
        const AUTO_INTERVAL = 4000; // 4 seconds
        const PROGRESS_STEP = 50; // update every 50ms

        // Drag / swipe state
        let isDragging = false;
        let startX = 0;
        let currentTranslate = 0;
        let dragDelta = 0;

        function goTo(index, smooth = true) {
            current = ((index % count) + count) % count;
            if (smooth) {
                track.classList.remove('no-transition');
            } else {
                track.classList.add('no-transition');
            }
            track.style.transform = `translateX(-${current * 100}%)`;
            dots.forEach((d, i) => d.classList.toggle('active', i === current));
            resetProgress();
        }

        function next() { goTo(current + 1); }
        function prev() { goTo(current - 1); }

        // Auto-scroll progress bar
        function resetProgress() {
            progressElapsed = 0;
            if (progressBar) progressBar.style.width = '0%';
        }

        function startAutoplay() {
            stopAutoplay();
            resetProgress();
            progressInterval = setInterval(() => {
                if (isPaused) return;
                progressElapsed += PROGRESS_STEP;
                const pct = Math.min((progressElapsed / AUTO_INTERVAL) * 100, 100);
                if (progressBar) progressBar.style.width = pct + '%';
                if (progressElapsed >= AUTO_INTERVAL) {
                    next();
                    // resetProgress is called inside goTo
                }
            }, PROGRESS_STEP);
        }

        function stopAutoplay() {
            if (progressInterval) clearInterval(progressInterval);
            progressInterval = null;
            resetProgress();
        }

        // Events: arrows
        prevBtn.addEventListener('click', (e) => { e.stopPropagation(); prev(); startAutoplay(); });
        nextBtn.addEventListener('click', (e) => { e.stopPropagation(); next(); startAutoplay(); });

        // Events: dots
        dots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                e.stopPropagation();
                goTo(parseInt(dot.dataset.index, 10));
                startAutoplay();
            });
        });

        // Pause on hover
        container.addEventListener('mouseenter', () => { isPaused = true; });
        container.addEventListener('mouseleave', () => { isPaused = false; });

        // Drag / touch support
        function onDragStart(e) {
            isDragging = true;
            startX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
            currentTranslate = -current * wrapper.offsetWidth;
            dragDelta = 0;
            track.classList.add('no-transition');
            wrapper.classList.add('grabbing');
            isPaused = true;
        }

        function onDragMove(e) {
            if (!isDragging) return;
            const x = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
            dragDelta = x - startX;
            track.style.transform = `translateX(${currentTranslate + dragDelta}px)`;
        }

        function onDragEnd() {
            if (!isDragging) return;
            isDragging = false;
            wrapper.classList.remove('grabbing');
            isPaused = false;

            const threshold = wrapper.offsetWidth * 0.2;
            if (dragDelta < -threshold) {
                next();
            } else if (dragDelta > threshold) {
                prev();
            } else {
                goTo(current);
            }
            startAutoplay();
        }

        // Mouse drag
        wrapper.addEventListener('mousedown', onDragStart);
        wrapper.addEventListener('mousemove', onDragMove);
        wrapper.addEventListener('mouseup', onDragEnd);
        wrapper.addEventListener('mouseleave', () => { if (isDragging) onDragEnd(); });

        // Touch drag
        wrapper.addEventListener('touchstart', onDragStart, { passive: true });
        wrapper.addEventListener('touchmove', onDragMove, { passive: true });
        wrapper.addEventListener('touchend', onDragEnd);

        // Keyboard
        container.setAttribute('tabindex', '0');
        container.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') { prev(); startAutoplay(); }
            if (e.key === 'ArrowRight') { next(); startAutoplay(); }
        });

        // Start
        startAutoplay();

        return { destroy: stopAutoplay };
    }

    function openProjectModal(project) {
        const m = project.meta;
        const tags = Array.isArray(m.tags) ? m.tags : [];

        // Build carousel from previews
        const previews = Array.isArray(m.previews) ? m.previews : [];
        const carouselHtml = buildCarouselHtml(previews);

        // Build header
        let headerHtml = `<h1>${m.title || 'Untitled'}</h1>`;

        // Meta tags
        if (tags.length > 0) {
            headerHtml += `<div class="modal-meta">${tags.map(t => `<span class="project-tag">${t}</span>`).join('')}</div>`;
        }

        // Links
        let linksHtml = '';
        if (m.github || m.demo) {
            linksHtml = '<div class="modal-meta-links">';
            if (m.github) {
                linksHtml += `<a href="${m.github}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-secondary">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                    <span>GitHub</span>
                </a>`;
            }
            if (m.demo) {
                linksHtml += `<a href="${m.demo}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-primary">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                    <span>Live Demo</span>
                </a>`;
            }
            linksHtml += '</div>';
        }

        // Render markdown body
        let bodyHtml = '';
        if (project.body && typeof marked !== 'undefined') {
            bodyHtml = marked.parse(project.body);
        } else if (project.body) {
            bodyHtml = `<p>${project.body}</p>`;
        }

        modalBody.innerHTML = carouselHtml + headerHtml + linksHtml + bodyHtml;

        // Initialize carousel if present
        const carouselEl = document.getElementById('modalCarousel');
        if (carouselEl) {
            activeCarousel = initCarousel(carouselEl);
        }

        // Show modal
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('modal-open');
    }

    function closeModal() {
        // Cleanup carousel
        if (activeCarousel) {
            activeCarousel.destroy();
            activeCarousel = null;
        }
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('modal-open');
    }

    modalClose.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // ---- Initialize ----
    async function init() {
        const [projects, certifications] = await Promise.all([
            loadMarkdownFiles(PROJECTS_DIR),
            loadMarkdownFiles(CERTS_DIR),
        ]);

        renderProjects(projects);
        renderCertifications(certifications);

        // Re-observe newly rendered elements for scroll reveal
        const revealObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        revealObserver.unobserve(entry.target);
                    }
                });
            },
            { rootMargin: '0px 0px -60px 0px', threshold: 0.1 }
        );

        document.querySelectorAll('.project-card, .cert-card').forEach(el => {
            el.classList.add('reveal');
            revealObserver.observe(el);
        });
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
