// Main graph application logic

let network = null;
let nodes = new vis.DataSet([]);
let edges = new vis.DataSet([]);
let nodeMap = new Map();
let nodeIdCounter = 1;

// Store all nodes and edges (including hidden ones)
let allNodes = new Map();
let allEdges = new Map();

// Store node relationships for quick lookup
let nodeRelations = new Map(); // nodeId -> {parent, children, siblings}

// Current focus state
let currentFocusNodeId = null;
let initialView = true;
let selectedNodeId = null;  // Track selected node for highlighting

function getNodeId(type, value) {
    const key = `${type}_${value}`;
    if (!nodeMap.has(key)) {
        nodeMap.set(key, nodeIdCounter++);
    }
    return nodeMap.get(key);
}

function createNode(id, label, type, color, data = {}, hidden = false) {
    let size = 15;
    let shape = 'dot';
    let font = { size: type === 'core' ? 16 : 14, color: '#333', face: 'Arial' };
    let title = `${type}: ${label || 'Resource'}`;
    
    if (type === 'core') {
        size = 60;  // Size for core topic
        shape = 'image';  // Use image shape when logo.png is available
        // Temporarily using star as fallback - uncomment image code below when logo.png is added
        // shape = 'star';  // Fallback to star if image not available
    } else if (type === 'category') {
        size = 35;
        shape = 'box';
        font = { size: 16, color: '#333', face: 'Arial', bold: true };
        title = `Category: ${data.label || label}`;
    } else if (type === 'subcategory') {
        size = 32;
        shape = 'box';
        font = { size: 14, color: '#333', face: 'Arial', bold: false };
        title = `Subcategory: ${label}`;
    } else if (type === 'direction') {
        size = 28;
        shape = 'box';  // Changed from diamond to box for rounded rectangle
        font = { size: 13, color: '#333', face: 'Arial' };
        // Use explored color if the direction is already explored
        if (data.explored) {
            color = '#d88b8b';  // Soft red for explored
            title = `${label} (Explored - ${data.resourceCount} resources)`;
        } else {
            title = `${label} (Not yet explored)`;
        }
    } else if (type === 'resource') {
        size = 10;  // Small dot
        shape = 'dot';
        font = { size: 0 };  // No label
        title = `Resource #${data.objectid || id}`;
    } else if (type === 'concept') {
        size = 18;
        shape = 'dot';
    }
    
    const node = {
        id: id,
        label: label,
        color: color,
        shape: shape,
        size: size,
        font: font,
        title: title,
        data: data,
        hidden: hidden
    };
    
    // Add rounded corners for box shapes (category, subcategory, direction)
    if (type === 'category' || type === 'subcategory' || type === 'direction') {
        node.borderRadius = 8;  // Rounded rectangle with 8px border radius
    }
    
    // Add image for core topic node
    if (type === 'core') {
        // Uncomment these lines when logo.png is added to the project root
        // node.image = 'logo.png';  // Path to the logo image
        // node.brokenImage = 'logo.png';  // Fallback if image fails to load
        
        // Temporary fallback: use star shape if image is not available
        if (!node.image) {
            node.shape = 'star';
            node.size = 50;
        }
    }
    
    return node;
}

// Knowledge graph data (loaded from JSON)
let graphData = null;
let DRL_CATEGORIES = {};

// Load knowledge graph data from JSON file
// All graph structure is defined in knowledge_graph_data.json
async function loadGraphData() {
    try {
        const response = await fetch('knowledge_graph_data.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        graphData = await response.json();
        
        // Validate required fields
        if (!graphData.coreTopic) {
            throw new Error('Missing coreTopic in graph data');
        }
        if (!graphData.categories || typeof graphData.categories !== 'object') {
            throw new Error('Missing or invalid categories in graph data');
        }
        
        DRL_CATEGORIES = graphData.categories;
        // Descriptions are now embedded in the node definitions, no separate descriptions object needed
        
        return graphData;
    } catch (error) {
        console.error('Error loading graph data:', error);
        updateStatus(`Error loading graph data: ${error.message}`, 'error');
        throw error; // Re-throw to prevent processing without valid data
    }
}

async function loadData() {
    updateStatus('Loading graph structure...', 'loading');

    try {
        // Step 1: Generate token if not already available
        if (!TOKEN) {
            updateStatus('Generating token...', 'loading');
            await generateToken();
        }
        
        // Step 2: Load graph structure from JSON (required)
        await loadGraphData();
        updateStatus('Graph structure loaded. Fetching resources...', 'loading');
        
        // Step 3: Load feature service data (resources)
        const url = `${FEATURE_SERVICE_URL}?where=1%3D1&outFields=*&f=json&token=${TOKEN}`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error.message || 'Error fetching data');
        }

        const featureCount = data.features ? data.features.length : 0;
        updateStatus(`Loaded ${featureCount} resources`, 'success');
        
        // Step 4: Render graph with resources
        await processData(data.features || []);
    } catch (error) {
        updateStatus(`Error: ${error.message}`, 'error');
        console.error('Error loading data:', error);
    }
}

async function processData(features) {
    // Graph structure must be loaded from JSON
    if (!graphData) {
        throw new Error('Graph data not loaded. Please load graph structure first.');
    }

    nodes.clear();
    edges.clear();
    nodeMap.clear();
    nodeIdCounter = 1;

    // Store all nodes and edges for later use
    allNodes.clear();
    allEdges.clear();
    nodeRelations.clear();
    
    // Create core topic node from JSON
    const coreTopicData = graphData.coreTopic;
    const coreTopicName = typeof coreTopicData === 'string' ? coreTopicData : coreTopicData.name;
    const coreDescription = typeof coreTopicData === 'object' ? coreTopicData.description : null;
    const coreTopicId = getNodeId('core', coreTopicName);
    
    const coreNode = createNode(
        coreTopicId,
        coreTopicName,
        'core',
        '#8b9dc7',
        { 
            type: 'core', 
            label: coreTopicName,
            description: coreDescription
        },
        false  // Always visible
    );
    nodes.add(coreNode);
    allNodes.set(coreTopicId, coreNode);
    nodeRelations.set(coreTopicId, { parent: null, children: [], siblings: [] });

    // Create category nodes and connect to core
    const categoryNodes = new Map();
    const categoryEdgeIds = new Map();
    const subcategoryNodes = new Map();
    const directionNodes = new Map();
    const directionResourceCount = new Map();
    const directionEdgeIds = new Map();
    const directionToCategory = new Map();
    const directionToSubcategory = new Map();
    
    // Helper function to check if value is an object (subcategories) or array (direct directions)
    function isObject(value) {
        return value !== null && typeof value === 'object' && !Array.isArray(value);
    }
    
    // Process categories - support both flat (array) and nested (object) structures
    Object.entries(DRL_CATEGORIES).forEach(([category, value]) => {
        const categoryId = getNodeId('category', category);
        categoryNodes.set(category, categoryId);
        
        // Get description and emoji from category data (new structure)
        const categoryDescription = isObject(value) && value.description ? value.description : null;
        const categoryEmoji = isObject(value) && value.emoji ? value.emoji : '';
        // Simple format: emoji and text on the same line
        const categoryLabel = categoryEmoji ? `${categoryEmoji} ${category}` : category;
        
        const categoryNode = createNode(
            categoryId,
            categoryLabel,
            'category',
            '#a67bb8',  // Purple for categories
            { 
                type: 'category', 
                label: category,
                emoji: categoryEmoji,
                description: categoryDescription
            },
            false  // Visible in initial view
        );
        nodes.add(categoryNode);
        allNodes.set(categoryId, categoryNode);
        
        // Store relationship
        const coreRelation = nodeRelations.get(coreTopicId);
        coreRelation.children.push(categoryId);
        nodeRelations.set(categoryId, { parent: coreTopicId, children: [], siblings: [] });
        
        // Connect category to core topic
        const edgeId = `edge_${coreTopicId}_${categoryId}`;
        const categoryEdge = {
            id: edgeId,
            from: coreTopicId,
            to: categoryId,
            color: { color: '#a67bb8' },
            arrows: 'to',
            hidden: false
        };
        edges.add(categoryEdge);
        allEdges.set(edgeId, categoryEdge);
        categoryEdgeIds.set(category, edgeId);
        
        // Check if category has subcategories (object with subcategories) or direct directions (array or object with directions)
        if (isObject(value)) {
            // Check if it has subcategories property
            if (value.subcategories) {
                // Category has subcategories (e.g., "Algorithm Families")
                Object.entries(value.subcategories).forEach(([subcategory, subcategoryData]) => {
                    const subcategoryId = getNodeId('subcategory', `${category}_${subcategory}`);
                    subcategoryNodes.set(`${category}_${subcategory}`, subcategoryId);
                    
                    // Get description for subcategory
                    const subcategoryDescription = subcategoryData.description || null;
                    
                    const subcategoryNode = createNode(
                        subcategoryId,
                        subcategory,
                        'subcategory',
                        '#9d6bb3',  // Darker purple for subcategories
                        { 
                            type: 'subcategory', 
                            label: subcategory,
                            category: category,
                            description: subcategoryDescription
                        },
                        true  // Hidden in initial view
                    );
                    nodes.add(subcategoryNode);
                    allNodes.set(subcategoryId, subcategoryNode);
                    
                    // Store relationship
                    const categoryRelation = nodeRelations.get(categoryId);
                    categoryRelation.children.push(subcategoryId);
                    nodeRelations.set(subcategoryId, { parent: categoryId, children: [], siblings: [] });
                    
                    // Connect subcategory to category
                    const subcategoryEdgeId = `edge_${categoryId}_${subcategoryId}`;
                    const subcategoryEdge = {
                        id: subcategoryEdgeId,
                        from: categoryId,
                        to: subcategoryId,
                        color: { color: '#9d6bb3' },
                        arrows: 'to',
                        hidden: true
                    };
                    edges.add(subcategoryEdge);
                    allEdges.set(subcategoryEdgeId, subcategoryEdge);
                    
                    // Process directions under subcategory
                    const directions = subcategoryData.directions || [];
                    directions.forEach(directionData => {
                        const direction = typeof directionData === 'string' ? directionData : directionData.name;
                        const directionDescription = typeof directionData === 'object' ? directionData.description : null;
                        
                        const directionId = getNodeId('direction', direction);
                        directionNodes.set(direction, directionId);
                        directionResourceCount.set(direction, 0);
                        directionToCategory.set(direction, category);
                        directionToSubcategory.set(direction, subcategory);
                        
                        const directionNode = createNode(
                            directionId,
                            direction,
                            'direction',
                            '#a8b3b4',  // Gray for unexplored
                            { 
                                type: 'direction', 
                                label: direction,
                                category: category,
                                subcategory: subcategory,
                                explored: false,
                                resourceCount: 0,
                                description: directionDescription
                            },
                            true  // Hidden in initial view
                        );
                        nodes.add(directionNode);
                        allNodes.set(directionId, directionNode);
                        
                        // Store relationship
                        const subcategoryRelation = nodeRelations.get(subcategoryId);
                        subcategoryRelation.children.push(directionId);
                        nodeRelations.set(directionId, { parent: subcategoryId, children: [], siblings: [] });
                        
                        // Connect direction to subcategory
                        const edgeId = `edge_${subcategoryId}_${directionId}`;
                        const directionEdge = {
                            id: edgeId,
                            from: subcategoryId,
                            to: directionId,
                            color: { color: '#a8b3b4' },
                            arrows: 'to',
                            hidden: true
                        };
                        edges.add(directionEdge);
                        allEdges.set(edgeId, directionEdge);
                        directionEdgeIds.set(direction, edgeId);
                    });
                });
            } else if (value.directions) {
                // Category has direct directions (object with directions array)
                const directions = value.directions || [];
                directions.forEach(directionData => {
                    const direction = typeof directionData === 'string' ? directionData : directionData.name;
                    const directionDescription = typeof directionData === 'object' ? directionData.description : null;
                    
                    const directionId = getNodeId('direction', direction);
                    directionNodes.set(direction, directionId);
                    directionResourceCount.set(direction, 0);
                    directionToCategory.set(direction, category);
                    
                    const directionNode = createNode(
                        directionId,
                        direction,
                        'direction',
                        '#a8b3b4',  // Gray for unexplored
                        { 
                            type: 'direction', 
                            label: direction,
                            category: category,
                            explored: false,
                            resourceCount: 0,
                            description: directionDescription
                        },
                        true  // Hidden in initial view
                    );
                    nodes.add(directionNode);
                    allNodes.set(directionId, directionNode);
                    
                    // Store relationship
                    const categoryRelation = nodeRelations.get(categoryId);
                    categoryRelation.children.push(directionId);
                    nodeRelations.set(directionId, { parent: categoryId, children: [], siblings: [] });
                    
                    // Connect direction to category
                    const edgeId = `edge_${categoryId}_${directionId}`;
                    const directionEdge = {
                        id: edgeId,
                        from: categoryId,
                        to: directionId,
                        color: { color: '#a8b3b4' },
                        arrows: 'to',
                        hidden: true
                    };
                    edges.add(directionEdge);
                    allEdges.set(edgeId, directionEdge);
                    directionEdgeIds.set(direction, edgeId);
                });
            }
        } else if (Array.isArray(value)) {
            // Category has direct directions (legacy array format)
            value.forEach(direction => {
                const directionName = typeof direction === 'string' ? direction : direction.name;
                const directionDescription = typeof direction === 'object' ? direction.description : null;
                
                const directionId = getNodeId('direction', directionName);
                directionNodes.set(directionName, directionId);
                directionResourceCount.set(directionName, 0);
                directionToCategory.set(directionName, category);
                
                const directionNode = createNode(
                    directionId,
                    directionName,
                    'direction',
                    '#a8b3b4',  // Gray for unexplored
                    { 
                        type: 'direction', 
                        label: directionName,
                        category: category,
                        explored: false,
                        resourceCount: 0,
                        description: directionDescription
                    },
                    true  // Hidden in initial view
                );
                nodes.add(directionNode);
                allNodes.set(directionId, directionNode);
                
                // Store relationship
                const categoryRelation = nodeRelations.get(categoryId);
                categoryRelation.children.push(directionId);
                nodeRelations.set(directionId, { parent: categoryId, children: [], siblings: [] });
                
                // Connect direction to category
                const edgeId = `edge_${categoryId}_${directionId}`;
                const directionEdge = {
                    id: edgeId,
                    from: categoryId,
                    to: directionId,
                    label: 'includes',
                    color: { color: '#a8b3b4' },
                    arrows: 'to',
                    hidden: true
                };
                edges.add(directionEdge);
                allEdges.set(edgeId, directionEdge);
                directionEdgeIds.set(directionName, edgeId);
            });
        }
    });

    const resourceSet = new Set();
    const resourceToDirections = new Map();
    const contributorStats = new Map(); // Track contributor statistics

    // Process resources and map them to research directions
    features.forEach((feature, index) => {
        const attrs = feature.attributes;
        
        // Create resource node (just a dot, no label)
        const resourceId = getNodeId('resource', attrs.objectid);
        if (!resourceSet.has(resourceId)) {
            resourceSet.add(resourceId);
            
            // Build Survey123 link URL
            let survey123Url = null;
            if (SURVEY123_SHARE_ID && attrs.objectid) {
                // Extract extent from geometry if available
                let extent = null;
                if (feature.geometry && feature.geometry.extent) {
                    const ext = feature.geometry.extent;
                    extent = `${ext.xmin},${ext.ymin},${ext.xmax},${ext.ymax}`;
                }
                survey123Url = buildSurvey123Link(SURVEY123_SHARE_ID, attrs.objectid, extent);
            }
            
                    // Extract tags from attributes
                    const tags = attrs.tags ? attrs.tags.split(',').map(t => t.trim()).filter(t => t) : [];
                    
                    const resourceNode = createNode(
                        resourceId,
                        '',  // No label, just a dot
                        'resource',
                        '#7db8b3',
                        { 
                            type: 'resource', 
                            url: survey123Url || attrs.link_url,  // Use Survey123 link if available, fallback to original
                            format: attrs.format,
                            objectid: attrs.objectid,
                            tags: tags,  // Store tags for display
                            fullData: attrs,
                            metadata: {
                                employee: attrs.employee_name,
                                email: attrs.employee_email,
                                account: attrs.agol_account,
                                why_submit: attrs.why_submit,
                                why_submit_other: attrs.why_submit_other,
                                creationDate: attrs.CreationDate
                            }
                        },
                        true  // Hidden in initial view
                    );
            nodes.add(resourceNode);
            allNodes.set(resourceId, resourceNode);
            nodeRelations.set(resourceId, { parent: null, children: [], siblings: [] });
            
            // Track contributor statistics
            if (attrs.employee_name) {
                const contributorName = attrs.employee_name;
                const currentCount = contributorStats.get(contributorName) || 0;
                contributorStats.set(contributorName, currentCount + 1);
            }
        }

        // Find research directions for this resource using auto-matching
        const resourceDirections = new Set();
        
        // Get all available research direction names
        const availableDirections = Array.from(directionNodes.keys());
        
        if (attrs.tags) {
            const tags = attrs.tags.split(',').map(t => t.trim()).filter(t => t);
            
            tags.forEach(tag => {
                // Use auto-matching to find research direction
                if (availableDirections.length > 0) {
                    const direction = autoMatchResearchDirection(tag, availableDirections);
                    if (direction && directionNodes.has(direction)) {
                        resourceDirections.add(direction);
                    }
                }
            });
        }

        // Connect resource to research directions
        resourceDirections.forEach(direction => {
            const directionId = directionNodes.get(direction);
            if (directionId) {
                const resourceEdgeId = `edge_${directionId}_${resourceId}`;
                const resourceEdge = {
                    id: resourceEdgeId,
                    from: directionId,
                    to: resourceId,
                    color: { color: '#7db8b3' },
                    arrows: 'to',
                    hidden: true
                };
                edges.add(resourceEdge);
                allEdges.set(resourceEdgeId, resourceEdge);
                
                // Store relationship
                const directionRelation = nodeRelations.get(directionId);
                directionRelation.children.push(resourceId);
                const resourceRelation = nodeRelations.get(resourceId);
                resourceRelation.parent = directionId;
                
                directionResourceCount.set(direction, directionResourceCount.get(direction) + 1);
                resourceToDirections.set(resourceId, direction);
            }
        });
    });

    // Update research direction nodes: mark explored ones and update colors
    const categoryExploredCount = new Map();
    const subcategoryExploredCount = new Map();
    
    // Initialize counts
    Object.keys(DRL_CATEGORIES).forEach(category => {
        categoryExploredCount.set(category, 0);
        const categoryValue = DRL_CATEGORIES[category];
        if (isObject(categoryValue)) {
            Object.keys(categoryValue).forEach(subcategory => {
                subcategoryExploredCount.set(`${category}_${subcategory}`, 0);
            });
        }
    });
    
    directionNodes.forEach((directionId, direction) => {
        const resourceCount = directionResourceCount.get(direction);
        if (resourceCount > 0) {
            // Mark as explored
            const node = nodes.get(directionId);
            if (node) {
                // Update in vis-network
                nodes.update({
                    id: directionId,
                    color: '#d88b8b',  // Soft red for explored
                    data: {
                        ...node.data,
                        explored: true,
                        resourceCount: resourceCount
                    }
                });
                
                // Also update in allNodes map to keep it in sync
                const allNode = allNodes.get(directionId);
                if (allNode) {
                    allNode.color = '#d88b8b';
                    allNode.data.explored = true;
                    allNode.data.resourceCount = resourceCount;
                }
                
                // Update edge color
                const edgeId = directionEdgeIds.get(direction);
                if (edgeId) {
                    edges.update({
                        id: edgeId,
                        color: { color: '#d88b8b' }
                    });
                    
                    // Also update in allEdges map
                    const allEdge = allEdges.get(edgeId);
                    if (allEdge) {
                        allEdge.color = { color: '#d88b8b' };
                    }
                }
                
                // Update category and subcategory explored counts
                const category = directionToCategory.get(direction);
                if (category) {
                    categoryExploredCount.set(category, categoryExploredCount.get(category) + 1);
                }
                
                const subcategory = directionToSubcategory.get(direction);
                if (subcategory) {
                    const subcategoryKey = `${category}_${subcategory}`;
                    subcategoryExploredCount.set(subcategoryKey, subcategoryExploredCount.get(subcategoryKey) + 1);
                    
                    // Update subcategory node color
                    const subcategoryId = subcategoryNodes.get(subcategoryKey);
                    if (subcategoryId) {
                        const subcategoryNode = nodes.get(subcategoryId);
                        if (subcategoryNode) {
                            nodes.update({
                                id: subcategoryId,
                                color: '#d88b8b',  // Explored color for subcategories with explored directions
                                data: {
                                    ...subcategoryNode.data,
                                    explored: true,
                                    exploredCount: subcategoryExploredCount.get(subcategoryKey)
                                }
                            });
                            
                            // Also update in allNodes map
                            const allSubcategoryNode = allNodes.get(subcategoryId);
                            if (allSubcategoryNode) {
                                allSubcategoryNode.color = '#d88b8b';
                                allSubcategoryNode.data.explored = true;
                                allSubcategoryNode.data.exploredCount = subcategoryExploredCount.get(subcategoryKey);
                            }
                            
                            // Update subcategory edge color
                            const categoryIdForEdge = categoryNodes.get(category);
                            if (categoryIdForEdge) {
                                const subcategoryEdgeId = `edge_${categoryIdForEdge}_${subcategoryId}`;
                                const subcategoryEdge = allEdges.get(subcategoryEdgeId);
                                if (subcategoryEdge) {
                                    edges.update({
                                        id: subcategoryEdgeId,
                                        color: { color: '#d88b8b' }
                                    });
                                    subcategoryEdge.color = { color: '#d88b8b' };
                                }
                            }
                        }
                    }
                }
            }
        }
    });
    
    // Update category nodes if they have explored directions
    categoryNodes.forEach((categoryId, category) => {
        const exploredCount = categoryExploredCount.get(category);
        if (exploredCount > 0) {
            const node = nodes.get(categoryId);
            if (node) {
                const categoryValue = DRL_CATEGORIES[category];
                let totalCount = 0;
                if (isObject(categoryValue)) {
                    if (categoryValue.directions) {
                        totalCount = categoryValue.directions.length;
                    } else if (categoryValue.subcategories) {
                        Object.values(categoryValue.subcategories).forEach(subcategoryData => {
                            if (subcategoryData.directions) {
                                totalCount += subcategoryData.directions.length;
                            }
                        });
                    }
                } else if (Array.isArray(categoryValue)) {
                    totalCount = categoryValue.length;
                }
                
                nodes.update({
                    id: categoryId,
                    color: '#d88b8b',  // Explored color for categories with explored directions
                    data: {
                        ...node.data,
                        explored: true,
                        exploredCount: exploredCount,
                        totalCount: totalCount
                    }
                });
                
                // Also update in allNodes map
                const allCategoryNode = allNodes.get(categoryId);
                if (allCategoryNode) {
                    allCategoryNode.color = '#d88b8b';
                    allCategoryNode.data.explored = true;
                    allCategoryNode.data.exploredCount = exploredCount;
                    allCategoryNode.data.totalCount = totalCount;
                }
                
                // Update category edge color
                const categoryEdgeId = `edge_${coreTopicId}_${categoryId}`;
                const categoryEdge = allEdges.get(categoryEdgeId);
                if (categoryEdge) {
                    edges.update({
                        id: categoryEdgeId,
                        color: { color: '#d88b8b' }
                    });
                    categoryEdge.color = { color: '#d88b8b' };
                }
            }
        }
    });

    // Update statistics (all data from JSON)
    // Calculate total directions - handle both flat arrays and nested objects
    let totalDirections = 0;
    Object.values(DRL_CATEGORIES).forEach(value => {
        if (Array.isArray(value)) {
            totalDirections += value.length;
        } else if (isObject(value)) {
            if (value.directions) {
                totalDirections += value.directions.length;
            } else if (value.subcategories) {
                Object.values(value.subcategories).forEach(subcategoryData => {
                    if (subcategoryData.directions) {
                        totalDirections += subcategoryData.directions.length;
                    }
                });
            }
        }
    });
    
    const exploredCount = Array.from(directionResourceCount.values()).filter(count => count > 0).length;
    document.getElementById('resourceCount').textContent = resourceSet.size;
    document.getElementById('directionCount').textContent = `${exploredCount}/${totalDirections}`;

    // Update contributors panel
    updateContributorsPanel(contributorStats);

    // Initialize or update network
    const container = document.getElementById('graph');
    const data = { nodes: nodes, edges: edges };
    const options = {
        nodes: {
            borderWidth: 2,
            shadow: true,
            font: {
                size: 16,
                face: 'Arial',
                multi: true,
                align: 'center'
            },
            margin: 5,
            chosen: {
                node: function(values, id, selected, hovering) {
                    if (selected || hovering) {
                        values.size = values.size * 1.15;
                        values.borderWidth = 4;
                        values.shadow = {
                            enabled: true,
                            color: 'rgba(102, 126, 234, 0.8)',
                            size: 15,
                            x: 0,
                            y: 0
                        };
                    }
                }
            }
        },
        edges: {
            width: 2,
            shadow: true,
            font: {
                size: 12,
                align: 'middle'
            },
            smooth: {
                type: 'continuous',
                roundness: 0.5
            }
        },
        physics: {
            enabled: true,
            stabilization: {
                enabled: true,
                iterations: 500,
                updateInterval: 25,
                onlyDynamicEdges: false,
                fit: true
            },
            barnesHut: {
                gravitationalConstant: -2000,
                centralGravity: 0.1,
                springLength: 150,
                springConstant: 0.08,
                damping: 0.15,
                avoidOverlap: 1.0
            },
            solver: 'barnesHut',
            maxVelocity: 50,
            minVelocity: 0.75,
            timestep: 0.5
        },
        layout: {
            improvedLayout: true,
            hierarchical: {
                enabled: false
            }
        },
        interaction: {
            hover: true,
            tooltipDelay: 100,
            zoomView: true,
            dragView: true
        }
    };

    if (network) {
        // Re-enable physics temporarily for new data
        network.setOptions({
            edges: {
                smooth: {
                    type: 'continuous',
                    roundness: 0.5
                }
            },
            physics: {
                enabled: true,
                stabilization: {
                    enabled: true,
                    iterations: 500,
                    updateInterval: 25,
                    onlyDynamicEdges: false,
                    fit: true
                },
                barnesHut: {
                    gravitationalConstant: -2000,
                    centralGravity: 0.1,
                    springLength: 150,
                    springConstant: 0.08,
                    damping: 0.15,
                    avoidOverlap: 1.0
                },
                solver: 'barnesHut',
                maxVelocity: 50,
                minVelocity: 0.75,
                timestep: 0.5
            },
            layout: {
                improvedLayout: true,
                hierarchical: {
                    enabled: false
                }
            }
        });
        
        network.setData(data);
        
        // Disable physics after stabilization to keep graph static
        network.once('stabilizationEnd', function() {
            // Immediately disable physics to stop all movement
            network.setOptions({
                physics: {
                    enabled: false
                }
            });
            
            // Stop any ongoing animations
            network.stopSimulation();
            
            network.fit({
                animation: false  // No animation, immediate fit
            });
        });
    } else {
        network = new vis.Network(container, data, options);
        
        // Add click event listener
        network.on('click', function(params) {
            if (params.nodes.length > 0) {
                const nodeId = params.nodes[0];
                const node = nodes.get(nodeId);
                
                // Focus on clicked node (show its context)
                if (node && !node.hidden) {
                    highlightNode(nodeId);
                    focusOnNode(nodeId);
                    showNodeInfo(node);
                }
            } else {
                clearHighlight();
                closeInfoPanel();
            }
        });

        // Fit to view on initialization and disable physics after stabilization
        network.once('stabilizationEnd', function() {
            // Immediately disable physics to stop all movement
            network.setOptions({
                physics: {
                    enabled: false
                }
            });
            
            // Stop any ongoing simulations
            network.stopSimulation();
            
            network.fit({
                animation: false  // No animation, immediate fit
            });
        });
        
        // Also listen for stabilization progress to disable physics as soon as possible
        network.on('stabilizationProgress', function(params) {
            // If stabilization is almost complete, disable physics early
            if (params.iterations >= 250) {
                network.setOptions({
                    physics: {
                        enabled: false
                    }
                });
                network.stopSimulation();
            }
        });
    }
}

function getNodeDescription(node) {
    // Get description directly from node data (stored when node was created)
    return node.data && node.data.description ? node.data.description : null;
}

function updateContributorsPanel(contributorStats) {
    const contributorCountElement = document.getElementById('contributorCount');
    if (contributorCountElement) {
        const totalContributors = contributorStats.size;
        contributorCountElement.textContent = totalContributors;
    }
}

function showNodeInfo(node) {
    const panel = document.getElementById('infoPanel');
    const title = document.getElementById('infoTitle');
    const content = document.getElementById('infoContent');

    title.textContent = node.label;
    let html = `<p><strong>Type:</strong> ${node.data.type}</p>`;

    // Add description if available
    const description = getNodeDescription(node);
    if (description) {
        html += `<div style="margin: 15px 0; padding: 12px; background: #f8f9fa; border-left: 3px solid #667eea; border-radius: 4px;">`;
        html += `<p style="margin: 0; line-height: 1.6; color: #333;">${description}</p>`;
        html += `</div>`;
    }

    if (node.data.type === 'core') {
        if (!description) {
            html += `<p>Core topic in Deep Reinforcement Learning research</p>`;
        }
    } else if (node.data.type === 'category') {
        html += `<p><strong>Category:</strong> ${node.data.label}</p>`;
        if (node.data.exploredCount !== undefined) {
            html += `<p><strong>Explored:</strong> ${node.data.exploredCount}/${node.data.totalCount} directions</p>`;
        }
    } else if (node.data.type === 'subcategory') {
        html += `<p><strong>Subcategory:</strong> ${node.data.label}</p>`;
        if (node.data.category) {
            html += `<p><strong>Category:</strong> ${node.data.category}</p>`;
        }
        if (node.data.exploredCount !== undefined) {
            html += `<p><strong>Explored Directions:</strong> ${node.data.exploredCount}</p>`;
        }
    } else if (node.data.type === 'direction') {
        html += `<p><strong>Research Direction:</strong> ${node.data.label}</p>`;
        if (node.data.category) {
            html += `<p><strong>Category:</strong> ${node.data.category}</p>`;
        }
        if (node.data.subcategory) {
            html += `<p><strong>Subcategory:</strong> ${node.data.subcategory}</p>`;
        }
        if (node.data.explored) {
            html += `<p style="color: #d88b8b;"><strong>Status:</strong> Explored</p>`;
            html += `<p><strong>Resources:</strong> ${node.data.resourceCount}</p>`;
        } else {
            html += `<p style="color: #a8b3b4;"><strong>Status:</strong> Not yet explored</p>`;
        }
    } else if (node.data.type === 'resource') {
        if (node.data.url) {
            html += `<p><strong>URL:</strong> <a href="${node.data.url}" target="_blank" style="color: #667eea; word-break: break-all;">${node.data.url}</a></p>`;
        }
        if (node.data.format) {
            html += `<p><strong>Format:</strong> ${node.data.format}</p>`;
        }
        if (node.data.tags && node.data.tags.length > 0) {
            html += `<p><strong>Tags:</strong> `;
            html += node.data.tags.map(tag => `<span style="display: inline-block; background: #e9ecef; color: #495057; padding: 4px 8px; border-radius: 4px; margin: 2px; font-size: 11px;">${tag}</span>`).join('');
            html += `</p>`;
        }
        if (node.data.metadata) {
            html += `<hr style="margin: 10px 0; border: none; border-top: 1px solid #eee;">`;
            html += `<p style="font-size: 11px; color: #666;"><strong>Metadata:</strong></p>`;
            if (node.data.metadata.employee) {
                html += `<p style="font-size: 11px; color: #666;">Submitted by: ${node.data.metadata.employee}</p>`;
            }
            if (node.data.metadata.why_submit_other) {
                html += `<p style="font-size: 11px; color: #666;">Note: ${node.data.metadata.why_submit_other}</p>`;
            }
            if (node.data.metadata.creationDate) {
                const date = new Date(node.data.metadata.creationDate);
                html += `<p style="font-size: 11px; color: #666;">Created: ${date.toLocaleString()}</p>`;
            }
        }
    } else if (node.data.type === 'concept') {
        html += `<p><strong>Key Concept:</strong> ${node.data.label}</p>`;
        html += `<p>Important concept in DRL research</p>`;
    }

    content.innerHTML = html;
    panel.classList.add('active');
}

function closeInfoPanel() {
    document.getElementById('infoPanel').classList.remove('active');
    clearHighlight();
}

function highlightNode(nodeId) {
    // Clear previous highlight
    clearHighlight();
    
    // Get the node
    const node = nodes.get(nodeId);
    if (!node) return;
    
    // Store selected node ID
    selectedNodeId = nodeId;
    
    // Get original node for size reference
    const originalNode = allNodes.get(nodeId);
    const baseSize = originalNode ? originalNode.size : node.size;
    
    // Create highlight style with enhanced visibility
    const highlightStyle = {
        borderWidth: 6,
        borderColor: '#667eea',
        color: {
            border: '#667eea',
            background: node.color,
            highlight: {
                border: '#667eea',
                background: node.color
            }
        },
        shadow: {
            enabled: true,
            color: 'rgba(102, 126, 234, 0.95)',
            size: 25,
            x: 0,
            y: 0
        },
        size: baseSize * 1.25,
        font: {
            ...node.font,
            bold: true,
            size: (node.font.size || 14) * 1.1
        }
    };
    
    // Update node with highlight
    nodes.update({
        id: nodeId,
        ...highlightStyle
    });
}

function clearHighlight() {
    if (selectedNodeId) {
        const node = nodes.get(selectedNodeId);
        if (node) {
            // Restore original style based on node type
            const originalNode = allNodes.get(selectedNodeId);
            if (originalNode) {
                const restoreStyle = {
                    borderWidth: 2,
                    borderColor: originalNode.color,
                    color: {
                        border: originalNode.color,
                        background: originalNode.color,
                        highlight: {
                            border: originalNode.color,
                            background: originalNode.color
                        }
                    },
                    shadow: {
                        enabled: true,
                        color: 'rgba(0, 0, 0, 0.3)',
                        size: 5,
                        x: 0,
                        y: 0
                    },
                    size: originalNode.size,
                    font: originalNode.font
                };
                
                nodes.update({
                    id: selectedNodeId,
                    ...restoreStyle
                });
            }
        }
        selectedNodeId = null;
    }
}

function resetView() {
    // Reset to initial view (show only core and categories)
    currentFocusNodeId = null;
    initialView = true;
    clearHighlight();
    
    // Update all nodes and edges visibility
    const nodeUpdates = [];
    const edgeUpdates = [];
    
    allNodes.forEach((node, nodeId) => {
        // Show: core and categories only
        const shouldShow = node.data.type === 'core' || node.data.type === 'category';
        const newHidden = !shouldShow;
        if (node.hidden !== newHidden) {
            node.hidden = newHidden;  // Update allNodes
            nodeUpdates.push({ id: nodeId, hidden: newHidden });
        }
    });
    
    allEdges.forEach((edge, edgeId) => {
        const fromNode = allNodes.get(edge.from);
        const toNode = allNodes.get(edge.to);
        // Show edges between visible nodes (core-category)
        const shouldShow = fromNode && !fromNode.hidden && toNode && !toNode.hidden &&
                          !(fromNode.data.type === 'resource' || toNode.data.type === 'resource');
        const newHidden = !shouldShow;
        if (edge.hidden !== newHidden) {
            edge.hidden = newHidden;  // Update allEdges
            edgeUpdates.push({ id: edgeId, hidden: newHidden });
        }
    });
    
    if (nodeUpdates.length > 0) {
        nodes.update(nodeUpdates);
    }
    if (edgeUpdates.length > 0) {
        edges.update(edgeUpdates);
    }
    
    // Update button visibility
    document.getElementById('resetBtn').style.display = 'none';
    document.getElementById('expandBtn').style.display = 'none';
    
    if (network) {
        network.fit({
            animation: {
                duration: 500,
                easingFunction: 'easeInOutQuad'
            }
        });
    }
}

// Collect only direct children (one level down)
function collectDirectChildren(nodeId, children) {
    const relation = nodeRelations.get(nodeId);
    if (!relation) return;
    
    // Only add direct children, not grandchildren
    relation.children.forEach(childId => {
        if (!children.has(childId)) {
            children.add(childId);
        }
    });
}

// Collect all ancestor nodes up to root
function collectAllAncestors(nodeId, ancestors) {
    const relation = nodeRelations.get(nodeId);
    if (!relation || !relation.parent) return;
    
    ancestors.add(relation.parent);
    collectAllAncestors(relation.parent, ancestors);  // Recursive
}

function focusOnNode(nodeId) {
    const relation = nodeRelations.get(nodeId);
    if (!relation) return;
    
    currentFocusNodeId = nodeId;
    initialView = false;
    
    // Collect nodes to show:
    // 1. Current node
    // 2. All ancestors up to root (core topic)
    // 3. Direct children only (one level down, no grandchildren)
    // 4. If current node is a leaf node, show all other leaf nodes with the same root
    const nodesToShow = new Set([nodeId]);
    
    // Collect all ancestors up to root
    collectAllAncestors(nodeId, nodesToShow);
    
    // Collect only direct children (one level)
    collectDirectChildren(nodeId, nodesToShow);
    
    // If current node is a leaf node (no children), find and show all other leaf nodes with the same parent
    if (relation.children.length === 0 && relation.parent) {
        // Find the direct parent node
        const parentId = relation.parent;
        const parentRelation = nodeRelations.get(parentId);
        
        if (parentRelation) {
            // Find all leaf nodes that are direct children of the same parent
            parentRelation.children.forEach(siblingId => {
                const siblingRelation = nodeRelations.get(siblingId);
                // Only add if it's also a leaf node (no children)
                if (siblingRelation && siblingRelation.children.length === 0) {
                    nodesToShow.add(siblingId);
                    // Also add ancestors of each sibling leaf node
                    collectAllAncestors(siblingId, nodesToShow);
                }
            });
        }
    }
    
    // Update node visibility
    const nodeUpdates = [];
    allNodes.forEach((node, id) => {
        const shouldShow = nodesToShow.has(id);
        const newHidden = !shouldShow;
        if (node.hidden !== newHidden) {
            node.hidden = newHidden;  // Update allNodes
            nodeUpdates.push({ id: id, hidden: newHidden });
        }
    });
    
    if (nodeUpdates.length > 0) {
        nodes.update(nodeUpdates);
    }
    
    // Update edge visibility - show edges between visible nodes
    const edgeUpdates = [];
    allEdges.forEach((edge, edgeId) => {
        const fromNode = allNodes.get(edge.from);
        const toNode = allNodes.get(edge.to);
        // Show edge if both nodes are visible and in nodesToShow
        const shouldShow = fromNode && toNode && 
                          nodesToShow.has(edge.from) && nodesToShow.has(edge.to);
        const newHidden = !shouldShow;
        if (edge.hidden !== newHidden) {
            edge.hidden = newHidden;  // Update allEdges
            edgeUpdates.push({ id: edgeId, hidden: newHidden });
        }
    });
    
    if (edgeUpdates.length > 0) {
        edges.update(edgeUpdates);
    }
    
    // Show navigation buttons
    document.getElementById('resetBtn').style.display = 'inline-block';
    document.getElementById('expandBtn').style.display = 'inline-block';
    
    // Fit to visible nodes
    if (network) {
        setTimeout(() => {
            network.fit({
                animation: {
                    duration: 500,
                    easingFunction: 'easeInOutQuad'
                }
            });
        }, 100);
    }
}

function expandAll() {
    // Show all nodes and edges
    const nodeUpdates = [];
    const edgeUpdates = [];
    
    allNodes.forEach((node, nodeId) => {
        if (node.hidden) {
            node.hidden = false;  // Update allNodes
            nodeUpdates.push({ id: nodeId, hidden: false });
        }
    });
    
    allEdges.forEach((edge, edgeId) => {
        if (edge.hidden) {
            edge.hidden = false;  // Update allEdges
            edgeUpdates.push({ id: edgeId, hidden: false });
        }
    });
    
    if (nodeUpdates.length > 0) {
        nodes.update(nodeUpdates);
    }
    if (edgeUpdates.length > 0) {
        edges.update(edgeUpdates);
    }
    
    initialView = false;
    
    if (network) {
        setTimeout(() => {
            network.fit({
                animation: {
                    duration: 500,
                    easingFunction: 'easeInOutQuad'
                }
            });
        }, 100);
    }
}

// Handle window resize
window.addEventListener('resize', function() {
    if (network) {
        network.fit({
            animation: false
        });
    }
});

// Auto-load data on page load
window.addEventListener('load', function() {
    loadData();
});

