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

uniform vec3 u_LightColor;
uniform vec3 u_ViewPosition;

varying vec3 v_normal;
varying vec3 v_position;

void main () {
    vec3 ambient = u_light.ambient * u_material.ambient;

    vec3 norm = v_normal;
    vec3 vertexPosition = v_position;

    vec3 lightDir = normalize(u_light.position - vertexPosition);
    float nDotL = max(dot(norm, lightDir), 0.0);
    vec3 diffuse = u_LightColor * u_light.diffuse * nDotL * u_material.diffuse;

    vec3 viewDir = normalize(u_ViewPosition - vertexPosition);
    // phone 一般算法
/*     vec3 reflectDir = reflect(-lightDir, norm);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), u_material.shininess); */
    // blinn phone 其他效果
   
    vec3 halfDir = normalize(lightDir + viewDir);
    float halfLambert = pow(max(dot(halfDir, norm), 0.0), u_material.shininess);
   

    vec3 specular = u_LightColor * u_light.specular * halfLambert * u_material.specular;
    vec3 resultColor = specular + diffuse + ambient;

    gl_FragColor = vec4(resultColor * 0.8, 1.0);
}