precision mediump float;

struct Material {
    vec3 ambient;
    sampler2D diffuse;
    sampler2D specular;
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

varying vec3 v_Normal;
varying vec3 v_Position;
varying vec2 v_TexCoord0;

void main() {
    vec3 ambient = u_light.ambient * vec3(texture2D(u_material.diffuse, v_TexCoord0));;
    vec3 vertexPosition = v_Position;
    vec3 normal = v_Normal;

    vec3 lightDir = normalize(u_light.position - vertexPosition);
    float nDotL = max(dot(normal, lightDir), 0.0);
    vec3 diffuse = u_light.diffuse * nDotL * vec3(texture2D(u_material.diffuse, v_TexCoord0));

    vec3 viewDir = normalize(u_ViewPosition - vertexPosition);
    vec3 lightPos = normalize(u_light.position);
    vec3 halfDir = normalize(lightPos + viewDir);

    float spec = pow(max(dot(normal, halfDir), 0.0), u_material.shininess);
    vec3 specular = u_light.specular * spec * vec3(texture2D(u_material.specular, v_TexCoord0));
    vec3 result = ambient + diffuse + specular;

    gl_FragColor = vec4(result, 1.0);
}