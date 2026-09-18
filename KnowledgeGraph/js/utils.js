// Utility functions

function normalizeTag(tag) {
    return tag.toLowerCase().trim();
}

// Calculate similarity between two strings (simple Jaccard-like similarity)
function calculateSimilarity(str1, str2) {
    const s1 = normalizeTag(str1);
    const s2 = normalizeTag(str2);
    
    // Exact match
    if (s1 === s2) return 1.0;
    
    // One contains the other
    if (s1.includes(s2) || s2.includes(s1)) {
        const minLen = Math.min(s1.length, s2.length);
        const maxLen = Math.max(s1.length, s2.length);
        return minLen / maxLen;
    }
    
    // Word-based similarity
    const words1 = s1.split(/[\s\-_]+/).filter(w => w.length > 2);
    const words2 = s2.split(/[\s\-_]+/).filter(w => w.length > 2);
    
    if (words1.length === 0 || words2.length === 0) return 0;
    
    let matches = 0;
    words1.forEach(w1 => {
        if (words2.some(w2 => w1.includes(w2) || w2.includes(w1))) {
            matches++;
        }
    });
    
    return matches / Math.max(words1.length, words2.length);
}

// Auto-match resource tags to research directions without using mappings
function autoMatchResearchDirection(tag, availableDirections) {
    const normalizedTag = normalizeTag(tag);
    
    // Try exact match first
    for (const direction of availableDirections) {
        const normalizedDirection = normalizeTag(direction);
        if (normalizedTag === normalizedDirection) {
            return direction;
        }
    }
    
    // Try substring match
    for (const direction of availableDirections) {
        const normalizedDirection = normalizeTag(direction);
        if (normalizedTag.includes(normalizedDirection) || normalizedDirection.includes(normalizedTag)) {
            return direction;
        }
    }
    
    // Try word-based matching
    const tagWords = normalizedTag.split(/[\s\-_]+/).filter(w => w.length > 2);
    for (const direction of availableDirections) {
        const normalizedDirection = normalizeTag(direction);
        const directionWords = normalizedDirection.split(/[\s\-_]+/).filter(w => w.length > 2);
        
        // Check if any significant words match
        const matchingWords = tagWords.filter(tw => 
            directionWords.some(dw => tw.includes(dw) || dw.includes(tw))
        );
        
        if (matchingWords.length > 0 && matchingWords.length >= Math.min(tagWords.length, directionWords.length) * 0.5) {
            return direction;
        }
    }
    
    // Try similarity-based matching
    let bestMatch = null;
    let bestScore = 0.3; // Minimum threshold
    
    for (const direction of availableDirections) {
        const score = calculateSimilarity(tag, direction);
        if (score > bestScore) {
            bestScore = score;
            bestMatch = direction;
        }
    }
    
    return bestMatch;
}

function updateStatus(message, type = '') {
    const statusEl = document.getElementById('status');
    statusEl.textContent = message;
    statusEl.className = `status ${type}`;
}

