import {
  MeshBasicMaterial,
  NearestFilter,
  ShaderMaterial,
  UniformsUtils,
  WebGLRenderTarget,
  Vector2,
} from "three";
import { Pass, FullScreenQuad } from "./Pass";
import { AfterShader } from "./AfterShader";

class AfterPass extends Pass {
  constructor(damp = 0.96, dt_size = 64) {
    super();

    if (AfterShader === undefined)
      console.error("THREE.AfterimagePass relies on AfterShader");

    this.shader = AfterShader;

    this.uniforms = UniformsUtils.clone(this.shader.uniforms);

    this.uniforms["resolution"].value = new Vector2(dt_size, dt_size);

    this.textureComp = new WebGLRenderTarget(
      window.innerWidth,
      window.innerHeight,
      {
        magFilter: NearestFilter,
      }
    );

    this.textureOld = new WebGLRenderTarget(
      window.innerWidth,
      window.innerHeight,
      {
        magFilter: NearestFilter,
      }
    );

    this.shaderMaterial = new ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: this.shader.vertexShader,
      fragmentShader: this.shader.fragmentShader,
    });

    this.compFsQuad = new FullScreenQuad(this.shaderMaterial);

    const material = new MeshBasicMaterial();
    this.copyFsQuad = new FullScreenQuad(material);
    this.time = 0;
    this.value1 = 0;
  }

  render(renderer, writeBuffer, readBuffer /*, deltaTime, maskActive*/) {
    this.uniforms["tOld"].value = this.textureOld.texture;
    this.uniforms["tNew"].value = readBuffer.texture;
    this.uniforms["time"].value = this.time;
    this.uniforms["value1"].value = this.value1;

    this.time += 0.005;

    renderer.setRenderTarget(this.textureComp);
    this.compFsQuad.render(renderer);

    this.copyFsQuad.material.map = this.textureComp.texture;

    if (this.renderToScreen) {
      renderer.setRenderTarget(null);
      renderer.setClearColor("white");
      this.copyFsQuad.render(renderer);
    } else {
      renderer.setRenderTarget(writeBuffer);

      if (this.clear) renderer.clear();

      this.copyFsQuad.render(renderer);
    }

    // Swap buffers.
    const temp = this.textureOld;
    this.textureOld = this.textureComp;
    this.textureComp = temp;
    // Now textureOld contains the latest image, ready for the next frame.
  }

  setSize(width, height) {
    this.textureComp.setSize(width, height);
    this.textureOld.setSize(width, height);
  }
}

export { AfterPass };
