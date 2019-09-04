// mvpMatrix
uniform mat4 u_worldViewProjection;
// lightPos
uniform vec3 u_lightWorldPos;
// ??
uniform mat4 u_world;
// normal InverseOf
uniform mat4 u_viewInverse;
// modelMatrix.inverseOf.transpose
uniform mat4 u_worldInverseTranspose;

attribute vec4 a_Position;
attribute vec3 a_normal;
attribute vec2 a_texcoord;

varying vec4 v_position;
varying vec2 v_texCoord;
varying vec3 v_normal;
varying vec3 v_surfaceToLight;
varying vec3 v_surfaceTOView;

void main() {
    v_texCoord = a_texcoord;
    v_position = u_worldViewProjection * a_position;
    v_normal = (u_worldInverseTranspose * vec4(a_normal, 0)).xyz
    // ???
    v_surfaceToLight = u_lightWorldPos - (u_world * a_position).xyz;
    v_surfaceToView = (u_viewInverse[3] - (u_world * a_position)).xyz;

    gl_Position = v_position;
}