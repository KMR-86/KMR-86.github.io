// Blog list page functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded in blogs.js');

    // First, initialize the hamburger menu
    if (typeof addHamburgerMenu === 'function') {
        console.log('Adding hamburger menu in blogs.js');
        addHamburgerMenu();
    } else {
        console.log('addHamburgerMenu function not found in blogs.js');
    }

    // Blog data structure with metadata and file paths
    const blogPosts = [
        {
            id: 'load-balancers',
            title: 'All about load balancers',
            date: 'April 14, 2023',
            excerpt: 'Understanding load balancers, their types, and how they help scale web applications.',
            file: 'blogs/load-balancers.md'
        },
        {
            id: 'migrating-rows',
            title: 'How we migrated 7.1 million rows in place',
            date: 'March 22, 2023',
            excerpt: 'A technical deep-dive into migrating millions of database rows without downtime.',
            file: 'blogs/migrating-rows.md'
        },
        {
            id: 'live-product-migration',
            title: 'How to migrate a live product',
            date: 'February 10, 2023',
            excerpt: 'Strategies and techniques for migrating a product while its live with minimal disruption.',
            file: 'blogs/live-product-migration.md'
        },
        {
            id: 'pre-mortem-document',
            title: 'What is a pre-mortem document',
            date: 'January 18, 2023',
            excerpt: 'How pre-mortem documents can identify potential project failures before they happen.',
            file: 'blogs/pre-mortem-document.md'
        }
    ];

    // Get the blog listing container
    const blogListing = document.querySelector('.blog-listing');

    // If we're on the blog listing page
    if (blogListing) {
        // Render all blog posts
        blogPosts.forEach(post => {
            const blogCard = document.createElement('div');
            blogCard.className = 'blog-card';
            blogCard.setAttribute('data-blog', post.id);

            blogCard.innerHTML = `
                <div class="blog-card-inner">
                    <div class="blog-date">${post.date}</div>
                    <h3 class="blog-title">${post.title}</h3>
                    <p class="blog-excerpt">${post.excerpt}</p>
                    <div class="blog-read-more">Read more →</div>
                </div>
            `;

            blogListing.appendChild(blogCard);

            // Add click event to navigate to the blog post
            blogCard.addEventListener('click', () => {
                window.location.href = `blog-single.html?id=${post.id}`;
            });
        });
    }

    // If we're on the home page with featured blogs
    const blogCards = document.querySelectorAll('#blog .blog-card');
    if (blogCards.length > 0) {
        blogCards.forEach(card => {
            card.addEventListener('click', () => {
                const blogId = card.getAttribute('data-blog');
                window.location.href = `blog-single.html?id=${blogId}`;
            });
        });
    }
});