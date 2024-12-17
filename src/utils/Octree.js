import * as THREE from "three";
class OctreeNode {
    constructor(min, max, level) {
        this.min = min;
        this.max = max;
        this.level = level;
        this.points = [];
        this.children = null;
    }

    containsPoint(point) {
        return (
            point.x >= this.min.x && point.x <= this.max.x &&
            point.y >= this.min.y && point.y <= this.max.y &&
            point.z >= this.min.z && point.z <= this.max.z
        );
    }

    getBoundingBoxCorners() {
        // Extract bounding box corners
        const { min, max } = this;
        const corners = [
            min,
            new THREE.Vector3(max.x, min.y, min.z), 
            new THREE.Vector3(max.x, max.y, min.z),
            new THREE.Vector3(min.x, max.y, min.z),
            new THREE.Vector3(min.x, min.y, max.z),
            new THREE.Vector3(max.x, min.y, max.z),
            new THREE.Vector3(max.x, max.y, max.z),
            new THREE.Vector3(min.x, max.y, max.z)
        ];
        return corners;
    }

    intersectsSphere(center, radius) {
        // Calculate the closest point to the sphere within this node's bounding box
        const closestPoint = new THREE.Vector3(
            Math.max(this.min.x, Math.min(center.x, this.max.x)),
            Math.max(this.min.y, Math.min(center.y, this.max.y)),
            Math.max(this.min.z, Math.min(center.z, this.max.z))
        );

        // Check if the closest point is within the sphere
        return closestPoint.distanceToSquared(center) <= radius * radius;
    }
}

class Octree {
    constructor(min, max, maxPointsPerNode = 10, maxDepth = 10) {
        this.root = new OctreeNode(min, max, 0);
        this.maxPointsPerNode = maxPointsPerNode;
        this.maxDepth = maxDepth;
        this.pointToNodeMap = new Map(); 
    }

    insert(point) {
        this._insertRecursive(this.root, point); 
    }
    
    _insertRecursive(node, point) {
        // Check if the point is within the bounds of the current node
        if (!node.containsPoint(point)) {
            return;
        }
    
        // Check if the node has children
        if (node.children !== null) {
            // Recursively insert the point into the appropriate child node
            for (const child of node.children) {
                this._insertRecursive(child, point);
            }
        } else {
            // Add the point to the current node
            node.points.push(point);
            this.pointToNodeMap.set(point, node); 
    
            // Check if the node exceeds the maximum points per node
            if (node.points.length > this.maxPointsPerNode && node.level < this.maxDepth) {

                // Split the node into eight child nodes
                if (node.children === null) {
                    this._splitNode(node);
                }
    
                // Recursively insert points into the appropriate child node
                for (const child of node.children) {
                    for (const p of node.points) {
                        this._insertRecursive(child, p);
                    }
                }
    
                // Clear points from the current node
                node.points = [];
            }
        }
    }

    remove(point) {
        const node = this.pointToNodeMap.get(point); 
        if (node) {
            const index = node.points.indexOf(point); 
            if (index !== -1) {
                node.points.splice(index, 1); 
            }
            this.pointToNodeMap.delete(point); 
        }
    }

    updatePoint(oldPoint, newPoint) {
        const node = this.pointToNodeMap.get(oldPoint);
        if (node && node.containsPoint(newPoint)) {
            // Update the point within the same node
            const index = node.points.indexOf(oldPoint);
            if (index !== -1) {
                node.points[index] = newPoint;
                this.pointToNodeMap.set(newPoint, node);
                this.pointToNodeMap.delete(oldPoint);
            }
        } else {
            // Remove the old point and insert the new point if it moved outside its current node
            this.remove(oldPoint);
            this.insert(newPoint);
        }
    }

    searchNeighbors(point, radius) {
        const neighbors = [];
        neighbors.push(point); 
        const queue = [this.root]; // Start with the root node
    
        while (queue.length > 0) {
            const node = queue.shift(); // Dequeue the next node
    
            // Check if the node's bounding box intersects with the search radius
            if (node.intersectsSphere(point, radius)) {
                if (node.children !== null) {
                    // If the node has children, enqueue them for further examination
                    queue.push(...node.children);
                } else {
                    // If the node is a leaf node, check each point within it
                    for (const p of node.points) {
                        const distance = point.distanceTo(p);
                        if (distance <= radius) {
                            neighbors.push(p);
                        }
                    }
                }
            }
        }
    
        return neighbors;
    }
    
    _splitNode(node) {
        const { min, max } = node;
        const midX = (min.x + max.x) / 2;
        const midY = (min.y + max.y) / 2;
        const midZ = (min.z + max.z) / 2;
        const level = node.level + 1;

        node.children = [
            new OctreeNode(min, new THREE.Vector3(midX, midY, midZ), level),
            new OctreeNode(new THREE.Vector3(midX, min.y, min.z), new THREE.Vector3(max.x, midY, midZ), level),
            new OctreeNode(new THREE.Vector3(midX, min.y, midZ), new THREE.Vector3(max.x, midY, max.z), level),
            new OctreeNode(new THREE.Vector3(min.x, min.y, midZ), new THREE.Vector3(midX, midY, max.z), level),
            new OctreeNode(new THREE.Vector3(min.x, midY, min.z), new THREE.Vector3(midX, max.y, midZ), level),
            new OctreeNode(new THREE.Vector3(midX, midY, min.z), new THREE.Vector3(max.x, max.y, midZ), level),
            new OctreeNode(new THREE.Vector3(midX, midY, midZ), new THREE.Vector3(max.x, max.y, max.z), level),
            new OctreeNode(new THREE.Vector3(min.x, midY, midZ), new THREE.Vector3(midX, max.y, max.z), level)
        ];
    }

    getAllBoundingBoxCorners() {
        let corners = []; 
        this._getAllBoundingBoxCornersRecursive(this.root, corners);
        return corners; 
    }

    _getAllBoundingBoxCornersRecursive(node, corners) {
        if (node.children !== null) {
            for (const child of node.children) {
                this._getAllBoundingBoxCornersRecursive(child, corners);
            }
        } else {
            corners.push(...node.getBoundingBoxCorners()); // Push corners directly into the flat array
        }
        return corners;
    }
}

export default Octree
