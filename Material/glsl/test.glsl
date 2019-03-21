  let vertexShaderSource = `
    attribute vec3 a_Position;
    attribute vec4 a_TexCoord;
    attribute vec3 a_Normal;
    attribute vec4 a_Color;

    uniform mat4 u_ModelViewMatrix;
    uniform mat3 u_NormalMatrix;
    uniform mat4 u_ProjectionMatrix;
    uniform mat4 u_ModelViewProjectionMatrix;
    uniform mat4 u_ModelViewMatrixInverse;
    uniform mat4 u_ProjectionMatrixInverse;
    uniform mat4 u_ModelViewProjectionMatrixInverse;

    struct LightInfo {
      vec4 position;
      vec3 ambient;
      vec3 diffuse;
      vec3 specular;
    };
    uniform LightInfo u_Light;

    struct MaterialInfo {
      vec3 ambient;
      vec3 diffuse;
      vec3 specular;
      float shine;
    };
    uniform MaterialInfo u_Material;

    varying vec3 v_LightIntensity;

    vec3 phong(vec4 glPosition, vec3 norm) {
      vec3 vertexPosition = normalize(vec3(u_Light.position - glPosition));
      vec3 v = normalize(-glPosition.xyz);
      vec3 reflectDir = reflect(-vertexPosition, norm);

      vec3 ambient = u_Light.ambient * u_Material.ambient;
      float sDotN = max(dot(vertexPosition, norm), 0.0);
      vec3 diffuse = u_Light.diffuse * u_Material.diffuse * sDotN;
      vec3 spec = vec3(0.0);

      if (sDotN > 0.0) {
        spec = u_Light.specular * u_Material.specular * pow(max(dot(reflectDir, v), 0.0), u_Material.shine);
      }

      return ambient + diffuse + spec;
    }

    void main() {
      // Calculate the point we are shading and it's normal.
      vec4 p = u_ModelViewMatrix * vec4(a_Position, 1.0);
      vec3 n = normalize(u_NormalMatrix * a_Normal);

      // Calculate lighting via the Phong reflection model.
      v_LightIntensity = phong(p, n);

      // Output the final position.
      gl_Position = u_ModelViewProjectionMatrix * vec4(a_Position, 1.0);
    }