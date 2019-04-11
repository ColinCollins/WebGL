attribute vec4 a_Position;
attribute vec4 a_Normal;

uniform mat4 u_ModelMatrix;
uniform mat4 u_MvpMatrix;
uniform mat4 u_NormalMatrix;

varying vec3 v_normal;
varying vec3 v_position;

void main () {
    gl_Position = u_MvpMatrix * a_Position;

    v_normal = normalize(vec3(u_NormalMatrix * a_Normal));
    v_position = vec3(u_ModelMatrix * a_Position);
}