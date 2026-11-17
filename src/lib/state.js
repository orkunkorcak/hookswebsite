// Three.js sahnesi ile kaydırma animasyonları arasındaki ortak durum.
// ScrollTrigger bu değerleri GSAP ile değiştirir, Scene3D her karede okur.
export const scene = {
  x: 0, // ağın yatay konumu
  y: 0,
  z: 0, // kameranın geri çekilmesi
  mix: 0, // 0 = camgöbeği, 1 = turuncuya kayma
  speed: 1, // dönüş hızı
  rotX: 0, // kaydırmayla eğilme
  bright: 1, // genel parlaklık
  spread: 0, // 0 = tek noktada toplanmış, 1 = tam dağılmış
  frame: 0, // logo çerçevelerinin büyüklüğü
  pointerX: 0,
  pointerY: 0,
  pointerOn: 0,
}

export const smooth = { lenis: null }

export function goTo(hash) {
  const el = document.querySelector(hash)
  if (!el) return
  if (smooth.lenis) {
    smooth.lenis.scrollTo(el, { duration: 1.6 })
  } else {
    el.scrollIntoView()
  }
}
