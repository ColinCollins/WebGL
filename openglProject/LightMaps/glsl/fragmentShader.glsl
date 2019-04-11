precision mediump float;
struct Material {
    vec3 ambient;
    vec3 diffuse;
    vec3 specular;      // 镜面反射
    float shininess;    // 反光度
};

struct Light {
    vec3 position;
    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
};


uniform Material u_material;
uniform Light u_light;

uniform vec3 u_ViewPosition;

varying vec3 v_normal;
varying vec3 v_position;

void main () {

}