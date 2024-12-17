uniform float uTime; 
uniform float uRadius;

attribute float neighbor;

varying float vNeighbor; 

void main() {
    vNeighbor = neighbor; 

    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;
    gl_PointSize = 300.0;
    if (neighbor == 1.0) {
        gl_PointSize *= 2.0; 
    }
    gl_PointSize *= (1.0 / - viewPosition.z);
}
