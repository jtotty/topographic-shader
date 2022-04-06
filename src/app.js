import './style.css'
import Application from './js/Application'

window.application = new Application({
  canvas: document.querySelector('canvas.webgl'),
})
