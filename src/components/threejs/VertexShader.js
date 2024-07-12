const VertexShader = `
uniform float uTime;
uniform float uRadius;
uniform float uSeparationDistance;
uniform float uAlignmentDistance;
uniform float uCohesionDistance;
uniform float uFreedomFactor;
uniform vec3 uPredator;

varying float vDistance;

mat3 rotation3dY(float angle) {
  float s = sin(angle);
  float c = cos(angle);
  return mat3(
    c, 0.0, -s,
    0.0, 1.0, 0.0,
    s, 0.0, c
  );
}

void main() {
  // Initialize variables
  vec3 newPosition = position;
  vec3 velocity = vec3(0.0);

  // Initialize variables for alignment, cohesion, and separation
  vec3 alignment = vec3(0.0); 
  vec3 cohesion = vec3(0.0); 
  vec3 separation = vec3(0.0); 

  // Loop through neighboring points
  
  // Update position based on velocity
  newPosition += velocity * uTime;

  // Calculate distance factor for sizing
  float distanceFactor = pow(uRadius - distance(newPosition, vec3(0.0)), 1.2);
  float size = distanceFactor * 10.0 + 10.0;

  // Rotate position
  //newPosition = newPosition * rotation3dY(uTime * 0.3 * distanceFactor);

  // Transform positions
  vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  // Output
  gl_Position = projectedPosition;
  gl_PointSize = 50.0; //size;
  gl_PointSize *= (1.0 / - viewPosition.z);
}
`;

export default VertexShader;
