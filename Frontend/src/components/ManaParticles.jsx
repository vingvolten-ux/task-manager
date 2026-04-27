import { useEffect, useRef } from "react"
import "./mana.css"

export default function ManaParticles() {
  const fieldRef = useRef(null)

  useEffect(() => {
    const field = fieldRef.current
    const particleCount = 70

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement("div")
      particle.className = "mana-particle"

      const size = Math.random() * 4 + 2
      particle.style.width = size + "px"
      particle.style.height = size + "px"

      particle.style.left = Math.random() * 100 + "%"

      const duration = Math.random() * 20 + 15
      particle.style.animationDuration = duration + "s"

      const delay = Math.random() * 20
      particle.style.animationDelay = delay + "s"

      field.appendChild(particle)
    }
  }, [])

  return <div className="mana-field" ref={fieldRef}></div>
}