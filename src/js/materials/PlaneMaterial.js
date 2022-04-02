/* eslint-disable no-plusplus */
import * as THREE from 'three'
import terrainVertexShader from '../../shaders/terrain/vertex.glsl'
import terrainFragmentShader from '../../shaders/terrain/fragment.glsl'
import terrainDepthVertexShader from '../../shaders/terrainDepth/vertex.glsl'
import terrainDepthFragmentShader from '../../shaders/terrainDepth/fragment.glsl'

/**
 * Setup our debug UI folder for the Plane Material.
 *
 * @param {Object} debug
 * @param {Object} uniforms
 * @param {Object} terrain
 */
const setupDebug = (debug, uniforms, terrain) => {
  const shaderOptions = debug.addFolder({ title: 'Shader', expanded: true })

  shaderOptions.addInput(uniforms.uElevation, 'value', {
    label: 'elevation',
    min: 0,
    max: 30,
    step: 0.001,
  })

  shaderOptions.addInput(terrain.texture, 'linesCount', {
    min: 1,
    max: 10,
    step: 1,
  }).on('change', () => {
    terrain.texture.update()
  })

  shaderOptions.addInput(terrain.texture, 'thickLineHeight', {
    min: 0,
    max: 0.1,
    step: 0.0001,
  }).on('change', () => {
    terrain.texture.update()
  })

  shaderOptions.addInput(terrain.texture, 'thinLineHeight', {
    min: 0,
    max: 0.1,
    step: 0.0001,
  }).on('change', () => {
    terrain.texture.update()
  })

  shaderOptions.addInput(terrain.texture, 'thinLineAlhpa', {
    min: 0,
    max: 1,
    step: 0.001,
  }).on('change', () => {
    terrain.texture.update()
  })

  shaderOptions.addInput(terrain.material.uniforms.uTextureFrequency, 'value', {
    label: 'frequency',
    min: 0.01,
    max: 50,
    step: 0.01,
  })

  const hueOptions = debug.addFolder({ title: 'Hue', expanded: true })

  hueOptions.addInput(terrain.material.uniforms.uHslHue, 'value', {
    label: 'Hue',
    min: 0,
    max: 5,
    step: 0.001,
  })

  hueOptions.addInput(terrain.material.uniforms.uHslHueOffset, 'value', {
    label: 'Offset',
    min: 0,
    max: 1,
    step: 0.001,
  })

  hueOptions.addInput(terrain.material.uniforms.uHslHueFrequency, 'value', {
    label: 'Frequency',
    min: 0,
    max: 50,
    step: 0.01,
  })

  hueOptions.addInput(terrain.material.uniforms.uHslTimeFrequency, 'value', {
    label: 'timeFrequency',
    min: 0,
    max: 0.0001,
    step: 0.00001,
  })

  hueOptions.addInput(terrain.material.uniforms.uHslLightness, 'value', {
    label: 'Lightness',
    min: 0,
    max: 1,
    step: 0.001,
  })

  hueOptions.addInput(terrain.material.uniforms.uHslLightnessVariation, 'value', {
    label: 'LightnessVariation',
    min: 0,
    max: 1,
    step: 0.001,
  })

  hueOptions.addInput(terrain.material.uniforms.uHslLightnessFrequency, 'value', {
    label: 'lightnessFrequency',
    min: 0,
    max: 50,
    step: 0.01,
  })
}

/**
 * Our plane material.
 *
 * @param {Object} debug
 * @returns {THREE.ShaderMaterial} material
 */
export default function PlaneMaterial(debug) {
  const terrain = {
    texture: {
      width: 32,
      height: 128,
      linesCount: 5,
      thickLineHeight: 0.05,
      thinLineHeight: 0.01,
      thinLineAlhpa: 0.35,
    },
  }

  const canvas = document.createElement('canvas')
  canvas.width = terrain.texture.width
  canvas.height = terrain.texture.height
  canvas.style.position = 'fixed'
  canvas.style.top = 0
  canvas.style.left = 0
  canvas.style.zIndex = 1

  terrain.texture.canvas = canvas
  document.body.append(terrain.texture.canvas)

  terrain.texture.context = terrain.texture.canvas.getContext('2d')

  terrain.texture.instance = new THREE.CanvasTexture(terrain.texture.canvas)
  terrain.texture.instance.wrapS = THREE.RepeatWrapping
  terrain.texture.instance.wrapT = THREE.RepeatWrapping
  terrain.texture.instance.magFilter = THREE.NearestFilter

  terrain.texture.update = () => {
    /*
      This code snippet erases the entire canvas.
      This is commonly required at the start of each frame in an animation.
      The dimensions of the cleared area are set to equal the
      <canvas> element's width and height attributes.
    */
    terrain.texture.context.clearRect(0, 0, terrain.texture.width, terrain.texture.height)

    // Thicker lines
    const actualThickLineHeight = Math.round(
      terrain.texture.height * terrain.texture.thickLineHeight,
    )
    terrain.texture.context.globalAlpha = 1
    terrain.texture.context.fillStyle = '#ffffff'
    terrain.texture.context.fillRect(
      0,
      0,
      terrain.texture.width,
      actualThickLineHeight,
    )

    // Thinner lines
    const actualThinLineHeight = Math.round(
      terrain.texture.height * terrain.texture.thinLineHeight,
    )

    for (let i = 0; i < terrain.texture.linesCount - 1; i++) {
      terrain.texture.context.globalAlpha = terrain.texture.thinLineAlhpa
      terrain.texture.context.fillStyle = '#00ffff'
      terrain.texture.context.fillRect(
        0,
        actualThickLineHeight + Math.round(
          terrain.texture.height / terrain.texture.linesCount,
        ) * (i + 1),
        terrain.texture.width,
        actualThinLineHeight,
      )
    }

    terrain.texture.instance.needsUpdate = true
  }

  terrain.texture.update()

  // Uniforms
  terrain.uniforms = {
    uTime: { value: 0 },
    uElevation: { value: 30 },
    uTexture: { value: terrain.texture.instance },
    uTextureFrequency: { value: 8.15 },
    uHslHue: { value: 1 },
    uHslHueOffset: { value: 0.4 },
    uHslHueFrequency: { value: 15.75 },
    uHslLightness: { value: 0.5 },
    uHslLightnessVariation: { value: 0.185 },
    uHslLightnessFrequency: { value: 24 },
    uHslTimeFrequency: { value: 0.00004 },
  }

  // Material for our topographic effect
  terrain.material = new THREE.ShaderMaterial({
    uniforms: terrain.uniforms,
    vertexShader: terrainVertexShader,
    fragmentShader: terrainFragmentShader,
    transparent: true,
    blending: THREE.AdditiveBlending,
  })

  // Pass depth information
  terrain.depthUniforms = THREE.UniformsUtils.merge([
    THREE.UniformsLib.common,
    THREE.UniformsLib.displacementmap,
    terrain.uniforms,
  ])

  // Material for the post-processing bokeh shader
  terrain.depthMaterial = new THREE.ShaderMaterial({
    uniforms: terrain.depthUniforms,
    vertexShader: terrainDepthVertexShader,
    fragmentShader: terrainDepthFragmentShader,
  })
  terrain.depthMaterial.depthPacking = THREE.RGBADepthPacking
  terrain.depthMaterial.blending = THREE.NoBlending

  if (debug) setupDebug(debug, terrain.uniforms, terrain)

  return terrain
}
