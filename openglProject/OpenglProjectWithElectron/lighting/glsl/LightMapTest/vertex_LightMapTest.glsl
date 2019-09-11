attribute vec4 a_Position;
attribute vec4 a_Normal;
attribute vec2 a_TexCoord0;
attribute vec2 a_TexCoord1;

uniform mat4 u_ModelMatrix;
uniform mat4 u_MvpMatrix;
uniform mat4 u_NormalMatrix;

varying vec3 v_Normal;
varying vec3 v_Position;
varying vec2 v_TexCoord0;

void main () {
    gl_Position = u_MvpMatrix * a_Position;

    v_Normal = normalize(vec3(u_NormalMatrix * a_Normal));
    v_Position = vec3 (u_ModelMatrix * a_Position);
    v_TexCoord0 = a_TexCoord0;
}