
// Single blog page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Blog data structure with metadata and file paths
    const blogPosts = [
        {
            id: 'load-balancers',
            title: 'All about load balancers',
            date: 'April 14, 2023',
            file: 'blogs/load-balancers.md'
        },
        {
            id: 'migrating-rows',
            title: 'How we migrated 7.1 million rows in place',
            date: 'March 22, 2023',
            file: 'blogs/migrating-rows.md'
        },
        {
            id: 'live-product-migration',
            title: 'How to migrate a live product',
            date: 'February 10, 2023',
            file: 'blogs/live-product-migration.md'
        },
        {
            id: 'pre-mortem-document',
            title: 'What is a pre-mortem document',
            date: 'January 18, 2023',
            file: 'blogs/pre-mortem-document.md'
        }
    ];

    // Get blog ID from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const blogId = urlParams.get('id');

    // Find the blog post data
    const blogPost = blogPosts.find(post => post.id === blogId);

    // If blog post exists
    if (blogPost) {
        // Update the page title
        document.title = `${blogPost.title} | K. M. Rahman`;

        // Update blog title and date
        document.getElementById('blog-title').textContent = blogPost.title;
        document.getElementById('blog-date').textContent = blogPost.date;

        // Fetch and render the markdown content
        fetch(blogPost.file)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Blog post not found');
                }
                return response.text();
            })
            .then(markdown => {
                // Use the marked library to convert markdown to HTML
                document.getElementById('blog-body').innerHTML = marked.parse(markdown);

                // Add syntax highlighting if you have a library for it
                if (window.Prism) {
                    Prism.highlightAll();
                }
            })
            .catch(error => {
                console.error('Error loading blog post:', error);
                document.getElementById('blog-body').innerHTML = '<p>Error loading blog post. Please try again later.</p>';
            });
    } else {
        // Handle case where blog post doesn't exist
        document.getElementById('blog-title').textContent = 'Blog Post Not Found';
        document.getElementById('blog-date').textContent = '';
        document.getElementById('blog-body').innerHTML = '<p>The requested blog post could not be found.</p>';
    }
});

// Ensure hamburger menu works on single blog post page
document.addEventListener('DOMContentLoaded', function() {
    // Call the hamburger menu function
    if (typeof addHamburgerMenu === 'function') {
        addHamburgerMenu();
    }

    // Get blog ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const blogId = urlParams.get('id');

    if (blogId) {
        // Load blog content
        // Your existing blog loading code...
    }
});