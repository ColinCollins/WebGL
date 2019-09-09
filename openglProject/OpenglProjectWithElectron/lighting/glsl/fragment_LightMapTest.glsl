precision mediump float;

struct Material {
    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
    float shininess;
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
uniform sampler2D u_Sampler0;
uniform sampler2D u_Sampler1;

varying vec3 v_Normal;
varying vec3 v_Position;
varying vec2 v_TexCoord0;
varying vec2 v_TexCoord1;

void main() {
    vec3 ambient = u_light.ambient * u_material.ambient;
    vec3 vertexPosition = v_Position;
    vec3 normal = v_Normal;

    vec3 lightDir = normalize(u_light.position - vertexPosition);
    float nDotL = max(dot(normal, lightDir), 0.0);
    vec3 diffuse = u_light.diffuse * nDotL * u_material.diffuse;

    vec3 viewDir = normalize(u_ViewPosition - vertexPosition);

    vec3 reflectDir = reflect(-lightDir, normal);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), u_material.shininess);
    vec3 specular = u_light.specular * spec * u_material.specular;
    vec3 result = ambient + diffuse + specular;

    gl_FragColor = vec4(result, 1.0);
}