const getRandomValue = (min: number, max: number) => {
  return (max - min) * Math.random() + min
}

export const getRandomColor = () => {
  return `rgb(${getRandomValue(200, 255)}, ${getRandomValue(
    0,
    255
  )}, ${getRandomValue(0, 255)})`
}
