/**
 * Section entity representing a social media section that can be hidden or redirected
 */
export class Section {
    constructor({
        id,
        name,
        platform,
        xpaths = [],
        currentPath = null,
        newPath = null,
        toClick = null
    }) {
        this.id = id;
        this.name = name;
        this.platform = platform;
        this.xpaths = xpaths;
        this.currentPath = currentPath;
        this.newPath = newPath;
        this.toClick = toClick;
    }

    /**
     * Check if this section is a hiding section (has XPaths)
     */
    isHideSection() {
        return this.xpaths && this.xpaths.length > 0;
    }

    /**
     * Check if this section is a redirect section
     */
    isRedirectSection() {
        return this.currentPath && this.newPath;
    }

    /**
     * Check if this section has a click action
     */
    hasClickAction() {
        return this.toClick && this.toClick.trim() !== '';
    }

    /**
     * Check if this section applies to the given hostname
     */
    appliesToHostname(hostname) {
        if (!this.platform) {return false;}
        
        // Dynamic hostname matching - check if hostname contains the platform name
        const platformVariations = this.getPlatformVariations(this.platform);
        
        return platformVariations.some(variation => 
            hostname.toLowerCase().includes(variation.toLowerCase())
        );
    }

    /**
     * Get all possible hostname variations for a platform
     */
    getPlatformVariations(platform) {
        const baseVariations = [
            platform,
            `${platform}.com`,
            `www.${platform}.com`
        ];

        // Special cases for known platforms
        const specialCases = {
            'twitter': ['twitter.com', 'x.com', 'www.twitter.com', 'www.x.com'],
            'reddit': ['reddit.com', 'www.reddit.com', 'old.reddit.com', 'new.reddit.com'],
            'youtube': ['youtube.com', 'www.youtube.com', 'm.youtube.com'],
            'linkedin': ['linkedin.com', 'www.linkedin.com'],
            'facebook': ['facebook.com', 'www.facebook.com', 'fb.com', 'm.facebook.com'],
            'instagram': ['instagram.com', 'www.instagram.com'],
            'tiktok': ['tiktok.com', 'www.tiktok.com'],
            'pinterest': ['pinterest.com', 'www.pinterest.com']
        };

        return specialCases[platform.toLowerCase()] || baseVariations;
    }

    /**
     * Check if current path should redirect to new path
     */
    shouldRedirect(currentPath) {
        if (!this.isRedirectSection()) {return false;}
        
        // Exact match
        if (currentPath === this.currentPath) {return true;}
        
        // Handle trailing slashes
        const normalizedCurrent = currentPath.replace(/\/$/, '') || '/';
        const normalizedTarget = this.currentPath.replace(/\/$/, '') || '/';
        
        return normalizedCurrent === normalizedTarget;
    }
}
