// Configuration constants
const FEATURE_SERVICE_URL = 'https://services1.arcgis.com/oC086ufSSQ6Avnw2/arcgis/rest/services/survey123_af503dce7c7347b0964bd3c39c541829_results/FeatureServer/0/query';

// ArcGIS credentials - replace with your username and password
const ARCGIS_USERNAME = '';  // Add your ArcGIS username here
const ARCGIS_PASSWORD = '';  // Add your ArcGIS password here

// Token will be generated dynamically
let TOKEN = null;

// Extract shareId from feature service URL
function extractShareId(serviceUrl) {
    const match = serviceUrl.match(/survey123_([a-f0-9]+)_results/);
    return match ? match[1] : null;
}

// Build Survey123 link URL
function buildSurvey123Link(shareId, objectId, extent = null) {
    if (!shareId || !objectId) return null;
    let url = `https://survey123.arcgis.com/share/${shareId}/result/data`;
    const params = [];
    if (extent) {
        params.push(`extent=${extent}`);
    }
    params.push(`objectIds=${objectId}`);
    if (params.length > 0) {
        url += `?${params.join('&')}`;
    }
    return url;
}

const SURVEY123_SHARE_ID = extractShareId(FEATURE_SERVICE_URL);

// Generate ArcGIS token using username and password
async function generateToken() {
    if (!ARCGIS_USERNAME || !ARCGIS_PASSWORD) {
        throw new Error('ArcGIS username and password must be configured in config.js');
    }
    
    const tokenUrl = 'https://www.arcgis.com/sharing/rest/generateToken';
    const formData = new URLSearchParams();
    formData.append('username', ARCGIS_USERNAME);
    formData.append('password', ARCGIS_PASSWORD);
    formData.append('referer', window.location.origin);
    formData.append('f', 'json');
    
    try {
        const response = await fetch(tokenUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formData
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error.message || 'Error generating token');
        }
        
        if (!data.token) {
            throw new Error('Token not received from ArcGIS');
        }
        
        TOKEN = data.token;
        return TOKEN;
    } catch (error) {
        console.error('Error generating token:', error);
        throw error;
    }
}

