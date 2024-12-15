uniform float uIorR;
uniform float uIorG;
uniform float uIorB;
uniform float uIorY;
uniform float uIorC;
uniform float uIorP;
uniform float uSaturation; 
uniform float uChromaticAberration; 
uniform float uRefractPower; 
uniform vec2 winResolution;
uniform sampler2D uTexture;

varying vec3 worldNormal;
varying vec3 eyeVector;

vec3 sat(vec3 rgb, float intensity) {
  vec3 L = vec3(0.2125, 0.7154, 0.0721);
  vec3 grayscale = vec3(dot(rgb, L));
  return mix(grayscale, rgb, intensity);
}

const int LOOP = 40; 

void main() {
  float iorRatioRed = 1.0 / uIorR;
  float iorRatioGreen = 1.0 / uIorG;
  float iorRatioBlue = 1.0 / uIorB;

  vec2 uv = gl_FragCoord.xy / winResolution.xy;
  vec3 normal = worldNormal;
  vec3 color = vec3(0.0);

  for (int i = 0; i < LOOP; i++) {
    float slide = float(i) / float(LOOP) * 0.35;

    vec3 refractVecR = refract(eyeVector, normal, iorRatioRed);
    vec3 refractVecG = refract(eyeVector, normal, iorRatioGreen);
    vec3 refractVecB = refract(eyeVector, normal, iorRatioBlue);
    vec3 refractVecY = refract(eyeVector, normal, (1.0/uIorY));
    vec3 refractVecC = refract(eyeVector, normal, (1.0/uIorC));
    vec3 refractVecP = refract(eyeVector, normal, (1.0/uIorP));

    float r = texture2D(uTexture, uv + refractVecR.xy * (uRefractPower + slide * 1.0) * uChromaticAberration).x * 0.5;

    float y = (texture2D(uTexture, uv + refractVecY.xy * (uRefractPower + slide * 1.0) * uChromaticAberration).x * 2.0 +
                texture2D(uTexture, uv + refractVecY.xy * (uRefractPower + slide * 1.0) * uChromaticAberration).y * 2.0 -
                texture2D(uTexture, uv + refractVecY.xy * (uRefractPower + slide * 1.0) * uChromaticAberration).z) / 6.0;

    float g = texture2D(uTexture, uv + refractVecG.xy * (uRefractPower + slide * 2.0) * uChromaticAberration).y * 0.5;

    float c = (texture2D(uTexture, uv + refractVecC.xy * (uRefractPower + slide * 2.5) * uChromaticAberration).y * 2.0 +
                texture2D(uTexture, uv + refractVecC.xy * (uRefractPower + slide * 2.5) * uChromaticAberration).z * 2.0 -
                texture2D(uTexture, uv + refractVecC.xy * (uRefractPower + slide * 2.5) * uChromaticAberration).x) / 6.0;
          
    float b = texture2D(uTexture, uv + refractVecB.xy * (uRefractPower + slide * 3.0) * uChromaticAberration).z * 0.5;

    float p = (texture2D(uTexture, uv + refractVecP.xy * (uRefractPower + slide * 1.0) * uChromaticAberration).z * 2.0 +
                texture2D(uTexture, uv + refractVecP.xy * (uRefractPower + slide * 1.0) * uChromaticAberration).x * 2.0 -
                texture2D(uTexture, uv + refractVecP.xy * (uRefractPower + slide * 1.0) * uChromaticAberration).y) / 6.0;

    float R = r + (2.0*p + 2.0*y - c)/3.0;
    float G = g + (2.0*y + 2.0*c - p)/3.0;
    float B = b + (2.0*c + 2.0*p - y)/3.0;

    
    /* color.r += texture2D(uTexture, uv + refractVecR.xy * (uRefractPower + slide * 1.0) * uChromaticAberration).r;
    color.g += texture2D(uTexture, uv + refractVecG.xy * (uRefractPower + slide * 2.0) * uChromaticAberration).g;
    color.b += texture2D(uTexture, uv + refractVecB.xy * (uRefractPower + slide * 3.0) * uChromaticAberration).b; */

    color.r += R;
    color.g += G;
    color.b += B; 

    color = sat(color, uSaturation);
  }

  color /= float(LOOP);

  float overallBrightnessFactor = 7.5; // Adjust this factor as needed
  color *= overallBrightnessFactor;

  gl_FragColor = vec4(color, 1.0);

  //vec3 refractVecR = refract(eyeVector, normal, iorRatioRed);
  //vec3 refractVecG = refract(eyeVector, normal, iorRatioGreen);
  //vec3 refractVecB = refract(eyeVector, normal, iorRatioBlue);

  //float R = texture2D(uTexture, uv + refractVecR.xy).r;
  //float G = texture2D(uTexture, uv + refractVecG.xy).g;
  //float B = texture2D(uTexture, uv + refractVecB.xy).b;

  //vec3 color = vec3(R, G, B);

  //vec4 color = texture2D(uTexture, uv + refractVec.xy);
  //gl_FragColor = color;
}