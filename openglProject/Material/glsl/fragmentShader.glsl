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
    // 环境反射
    vec3 ambient = u_light.ambient * u_material.ambient;

    // 漫反射
    vec3 norm = v_normal;
    vec3 vertexPosition = v_position;
    // A - B = BA
    vec3 lightDir = normalize(u_light.position - vertexPosition);
    float nDotL = max(dot(norm, lightDir), 0.0);
    vec3 diffuse = u_light.diffuse * nDotL * u_material.diffuse;

    // 镜面反射
    vec3 viewDir = normalize(u_ViewPosition - vertexPosition);
    // 计算反射方向
    vec3 reflectDir = reflect(-lightDir, norm);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), u_material.shininess);
    vec3 specular = u_light.specular * spec * u_material.specular;
    vec3 result = ambient + diffuse + specular;

    gl_FragColor = vec4(result, 1.0);
}