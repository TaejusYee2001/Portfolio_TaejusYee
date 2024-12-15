varying vec3 vPosition;
varying vec2 vUv; 

uniform float maxDistance;
uniform float lineWidth; 

void main() {
  float distance = length(vPosition.xy);
  float alpha = 1.0 - smoothstep(0.0, maxDistance, distance);

  if (distance < 2.0) {
    alpha = 1.0;
  }

  float lineDistance = abs(vUv.x - 0.5);
  float line = smoothstep(0.5 - lineWidth / 2.0, 0.5 - lineWidth / 2.0 + 0.01, 1.0 - lineDistance);

  gl_FragColor = vec4(1.0, 1.0, 1.0, alpha * line * 1.2);
}