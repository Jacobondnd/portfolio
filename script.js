// Main script file for the portfolio
console.log("Portfolio script loaded.");

// Function to load content dynamically
async function loadComponent(componentPath, placeholderId, cssPath = null, jsPath = null) {
    const placeholder = document.getElementById(placeholderId);
    if (!placeholder) {
        console.error(`Placeholder element with ID ${placeholderId} not found.`);
        return;
    }

    try {
        // Fetch HTML content
        const response = await fetch(`${componentPath}/index.html`);
        if (!response.ok) {
            throw new Error(`Failed to load HTML for ${componentPath}: ${response.statusText}`);
        }
        const htmlContent = await response.text();
        placeholder.innerHTML = htmlContent;
        console.log(`${componentPath} HTML loaded into ${placeholderId}`);

        // Load CSS if provided
        if (cssPath) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = `${componentPath}/${cssPath}`;
            document.head.appendChild(link);
            console.log(`${componentPath}/${cssPath} loaded.`);
        }

        // Load JS if provided
        if (jsPath) {
            // Check if script already exists to prevent duplicates if reloaded
            const existingScript = document.querySelector(`script[src="${componentPath}/${jsPath}"]`);
            if (!existingScript) {
                const script = document.createElement('script');
                script.src = `${componentPath}/${jsPath}`;
                script.defer = true; // Ensure HTML is parsed before script runs
                document.body.appendChild(script);
                console.log(`${componentPath}/${jsPath} loaded.`);
            } else {
                 console.log(`${componentPath}/${jsPath} already loaded.`);
                 // If the script needs re-initialization logic, it should handle it internally
                 // or we might need a more complex loading mechanism (e.g., using modules or callbacks)
            }
        }

    } catch (error) {
        console.error(`Error loading component ${componentPath}:`, error);
        placeholder.innerHTML = `<p>Error loading component: ${error.message}</p>`;
        placeholder.style.color = 'red';
    }
}

// Load components when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded and parsed. Loading components...");
    loadComponent('weather-app', 'weather-app-placeholder', 'style.css', 'script.js');
    loadComponent('calculator-app', 'calculator-app-placeholder', 'style.css', 'script.js');
    loadComponent('restaurant-website', 'restaurant-website-placeholder', 'style.css'); // No JS needed for this static component yet
});
