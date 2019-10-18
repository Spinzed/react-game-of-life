// Here are defined presets for the Draw section.
// This file exports shapes arraz which contains shapes. Shapes are
//   objects with 2 attributes: name and cells.
// The 'cells' attribute an array which contains relative coordinates
//    of the cells of the shape to the middle cell of the shape.

const shapes = [
  {
    name: "oscillator",
    cells: [
      [0, 0],
      [-1, 0],
      [1, 0]
    ]
  },
  {
    name: "glider",
    cells: [
      [0, 0],
      [-1, -1],
      [1, -1],
      [1, 0],
      [0, 1]
    ]
  }
]

export default shapes;
