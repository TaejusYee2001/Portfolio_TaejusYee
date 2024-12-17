varying float vNeighbor;

vec3 color; 
void main() {
    float strength = distance(gl_PointCoord, vec2(0.5));
    strength = 1.0 - strength;
    strength = pow(strength, 3.0);
    if (vNeighbor != 0.0) {
        color = vec3(1.0, 0.0, 0.0);
        color = mix(vec3(0.0), color, strength);
    }
    else {
        color = vec3(1.0, 1.0, 1.0); 
        color = mix(vec3(0.0), color, strength);
    }
    gl_FragColor = vec4(color, strength);
}
